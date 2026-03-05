import { type Prisma } from "@/lib/db"

export type StudentWithSubscriptions = Prisma.StudentGetPayload<{
  include: { subscriptions: true; user: true }
}>
