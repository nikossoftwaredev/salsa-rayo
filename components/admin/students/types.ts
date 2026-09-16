import { type Prisma } from "@/lib/db"

export type StudentWithSubscriptions = Prisma.StudentGetPayload<{
  include: {
    subscriptions: { include: { scheduleEntries: { select: { id: true } } } }
    user: true
  }
}>
