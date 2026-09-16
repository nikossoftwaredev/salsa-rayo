import { type Prisma } from "@/lib/db"

// Future attendance rows ("bookings") are ordinary Attendance rows on a
// DanceClass whose date is still ahead. There is no status column: a row on a
// future date is a booking, a row on a past date is an attendance.

type Db = Prisma.TransactionClient

const DAY_MS = 24 * 60 * 60 * 1000

/** DanceClass.date convention: UTC midnight of the local calendar day. */
export const toClassDate = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))

/** 1 = Monday ... 7 = Sunday, matching ScheduleEntry.dayIndex. */
const toDayIndex = (classDate: Date) => classDate.getUTCDay() || 7

const maxDate = (a: Date, b: Date) => (a > b ? a : b)

interface CreateBookingsInput {
  db: Db
  studentId: string
  scheduleEntryIds: string[]
  from: Date
  to: Date
}

/**
 * Books the student into every class of the given schedule entries between
 * `from` (inclusive) and `to` (exclusive). Never books the past, and skips
 * classes the student is already booked into.
 */
export const createBookings = async ({ db, studentId, scheduleEntryIds, from, to }: CreateBookingsInput) => {
  if (scheduleEntryIds.length === 0) return 0

  const start = maxDate(toClassDate(from), toClassDate(new Date()))
  const end = toClassDate(to)
  if (start >= end) return 0

  const entries = await db.scheduleEntry.findMany({
    where: { id: { in: scheduleEntryIds }, isActive: true },
    include: { instructors: { select: { id: true } } },
  })
  if (entries.length === 0) return 0

  const existingClasses = await db.danceClass.findMany({
    where: {
      scheduleEntryId: { in: entries.map((e) => e.id) },
      date: { gte: start, lt: end },
    },
    select: { id: true, scheduleEntryId: true, date: true },
  })
  const classIds = new Map(
    existingClasses.map((c) => [`${c.scheduleEntryId}|${c.date.getTime()}`, c.id])
  )

  const danceClassIds: string[] = []
  for (let time = start.getTime(); time < end.getTime(); time += DAY_MS) {
    const date = new Date(time)
    for (const entry of entries) {
      if (entry.dayIndex !== toDayIndex(date)) continue

      const existingId = classIds.get(`${entry.id}|${time}`)
      if (existingId) {
        danceClassIds.push(existingId)
        continue
      }

      const created = await db.danceClass.create({
        data: {
          scheduleEntryId: entry.id,
          date,
          title: entry.title,
          time: entry.time,
          instructors: { connect: entry.instructors },
        },
        select: { id: true },
      })
      danceClassIds.push(created.id)
    }
  }

  const result = await db.attendance.createMany({
    data: danceClassIds.map((danceClassId) => ({ danceClassId, studentId })),
    skipDuplicates: true,
  })
  return result.count
}

interface RemoveBookingsInput {
  db: Db
  studentId: string
  /** Limit to these schedule entries. Omit to remove from any class. */
  scheduleEntryIds?: string[]
  from?: Date
  to?: Date
}

/**
 * Removes the student's bookings in [from, to). Only classes from tomorrow
 * onwards are touched, so today's and past attendance is never deleted.
 */
export const removeBookings = async ({ db, studentId, scheduleEntryIds, from, to }: RemoveBookingsInput) => {
  if (scheduleEntryIds?.length === 0) return 0

  const tomorrow = new Date(toClassDate(new Date()).getTime() + DAY_MS)
  const start = from ? maxDate(toClassDate(from), tomorrow) : tomorrow
  const end = to ? toClassDate(to) : undefined
  if (end && start >= end) return 0

  const result = await db.attendance.deleteMany({
    where: {
      studentId,
      danceClass: {
        date: { gte: start, ...(end && { lt: end }) },
        ...(scheduleEntryIds && { scheduleEntryId: { in: scheduleEntryIds } }),
      },
    },
  })
  return result.count
}

interface SyncBookingsInput {
  db: Db
  studentId: string
  previousEntryIds: string[]
  nextEntryIds: string[]
  /** The period the booking change applies to. */
  from: Date
  to: Date
}

/**
 * Applies a change of the subscription's classes inside one period: drops
 * future bookings of classes that were deselected and books the newly added
 * ones. Unchanged classes are left alone, so bookings the admin removed by
 * hand stay removed.
 */
export const syncBookings = async ({ db, studentId, previousEntryIds, nextEntryIds, from, to }: SyncBookingsInput) => {
  const previous = new Set(previousEntryIds)
  const next = new Set(nextEntryIds)
  const removed = previousEntryIds.filter((id) => !next.has(id))
  const added = nextEntryIds.filter((id) => !previous.has(id))

  await removeBookings({ db, studentId, scheduleEntryIds: removed, from, to })
  await createBookings({ db, studentId, scheduleEntryIds: added, from, to })
}
