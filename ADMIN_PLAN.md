# Salsa Rayo Admin System — Implementation Plan

## Context

Salsa Rayo is a dance school in Athens. The owner needs an admin panel where a secretary can manage students, record attendance, track subscriptions/payments, and view stats. Currently there's a basic admin with client CRUD. This plan builds the full system.

**Quick fix included**: Remove `engines` field from `package.json` to fix Vercel Node.js warning.

---

## Phase 0: Quick Fixes

### 0a. Remove engines field from package.json
- Remove `"engines": { "node": ">=20.19.0" }` from `package.json`

### 0b. Rename "Clients" → "Students" throughout admin
- Rename the Prisma `Client` model to `Student`
- Update all references: `lib/auth.ts`, server actions, admin components, types
- Update sidebar labels and route paths (`/admin/clients` → `/admin/students`)
- Update admin pages and components

---

## Phase 1: Database Schema

### New/Modified Models in `lib/db/schema.prisma`

**Update Student (renamed from Client):**
```prisma
model Student {
  id              String         @id @default(cuid())
  userId          String?        @unique
  user            User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  name            String
  email           String
  phone           String?
  notes           String?
  isActive        Boolean        @default(true)
  rayoPoints      Int            @default(0)
  subscriptions   Subscription[]
  transactions    Transaction[]
  attendances     Attendance[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}
```
- Drop unused fields: company, address, city, state, postalCode, country
- Add `rayoPoints` (Int, default 0)
- Add relations to new models
- Make `userId` optional (admin can create students without a linked Google account)

**New: Subscription**
```prisma
model Subscription {
  id              String        @id @default(cuid())
  studentId       String
  student         Student       @relation(fields: [studentId], references: [id], onDelete: Cascade)
  packageName     String        // "Rayo 8", "Rayo 16", "Rayo 24", or custom
  lessonsPerWeek  Int           // 2, 4, 6
  amountPaid      Float
  startDate       DateTime      @default(now())
  expiresAt       DateTime      // 30 days from startDate
  isActive        Boolean       @default(true)
  transactions    Transaction[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```
- Weekly cap model: `lessonsPerWeek` defines how many classes per week
- Active if `isActive && expiresAt > now()`
- Attendance checks: count this week's attendances vs lessonsPerWeek

**New: Transaction**
```prisma
model Transaction {
  id              String        @id @default(cuid())
  studentId       String
  student         Student       @relation(fields: [studentId], references: [id], onDelete: Cascade)
  subscriptionId  String?
  subscription    Subscription? @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)
  amount          Float
  type            String        // "subscription", "points_redemption", "refund", "other"
  paymentMethod   String        // "cash", "card", "bank_transfer"
  description     String?
  createdAt       DateTime      @default(now())
}
```

**New: DanceClass**
```prisma
model DanceClass {
  id              String       @id @default(cuid())
  date            DateTime     // date of the class
  timeSlot        String       // "19:00 - 20:00"
  title           String       // "Salsa", "Bachata 1"
  level           String?      // "Beginners", "Improvers"
  instructor      String       // instructor name
  attendances     Attendance[]
  createdAt       DateTime     @default(now())
}
```

**New: Attendance**
```prisma
model Attendance {
  id              String     @id @default(cuid())
  danceClassId    String
  danceClass      DanceClass @relation(fields: [danceClassId], references: [id], onDelete: Cascade)
  studentId       String
  student         Student    @relation(fields: [studentId], references: [id], onDelete: Cascade)
  createdAt       DateTime   @default(now())

  @@unique([danceClassId, studentId])
}
```

### Migration Steps
1. Update schema.prisma with all changes
2. Run `pnpm prisma db push` (or generate migration)
3. Run `pnpm prisma generate`

---

## Phase 2: Server Actions

All server actions follow the existing pattern: `"use server"` directive, `isAdmin()` guard, try/catch, typed returns.

### Student Actions (`server-actions/students/`)
| File | Purpose |
|------|---------|
| `get-students.ts` | List all students with search/filter |
| `get-student.ts` | Get single student with relations (subscriptions, attendance, transactions) |
| `create-student.ts` | Create student (no User needed) |
| `update-student.ts` | Update student details |

### Subscription Actions (`server-actions/subscriptions/`)
| File | Purpose |
|------|---------|
| `create-subscription.ts` | Create subscription + transaction in one Prisma transaction |
| `get-subscriptions.ts` | List subscriptions with filters (active/expired) |
| `deactivate-subscription.ts` | Manually deactivate a subscription |

### Attendance Actions (`server-actions/attendance/`)
| File | Purpose |
|------|---------|
| `create-class.ts` | Create a DanceClass record for a date/time |
| `record-attendance.ts` | Batch record attendance: creates Attendance records, awards +1 Rayo point per student |
| `get-attendance.ts` | Get attendance for a class or student |
| `get-classes.ts` | List classes with optional date filter |

### Transaction Actions (`server-actions/transactions/`)
| File | Purpose |
|------|---------|
| `get-transactions.ts` | List transactions with filters |
| `create-transaction.ts` | Record a standalone transaction |

### Dashboard Actions (`server-actions/dashboard/`)
| File | Purpose |
|------|---------|
| `get-dashboard-stats.ts` | Aggregate stats: total students, active subs, monthly revenue, attendance this month |

---

## Phase 3: Account Linking

In `lib/auth.ts` session callback, update the logic:

```
Current: If no Client exists for user, create one
New: If no Student linked to this userId, check if a Student with matching email exists:
  - If yes → link the Student to the User (set userId)
  - If no → create a new Student linked to the User
```

This handles the case where admin manually creates "John john@gmail.com" and later John logs in with Google — the accounts merge automatically.

---

## Phase 4: Admin Routes & Pages

### Updated Sidebar Navigation
```
Dashboard     → /admin              (IoHome)
Students      → /admin/students     (IoPeople)
Attendance    → /admin/attendance   (IoCalendar)
Subscriptions → /admin/subscriptions (IoCard)
Transactions  → /admin/transactions (IoReceipt)
Settings      → /admin/settings     (IoSettings)
```

### Route Structure
```
app/[locale]/admin/
├── page.tsx                          → Dashboard (stats cards)
├── students/
│   ├── page.tsx                      → Student list
│   ├── new/page.tsx                  → New student form
│   └── [id]/page.tsx                 → Student profile
├── attendance/
│   ├── page.tsx                      → Attendance overview / class list
│   └── record/page.tsx               → Record attendance for a class
├── subscriptions/
│   ├── page.tsx                      → All subscriptions list
│   └── new/page.tsx                  → Create subscription + payment
├── transactions/
│   └── page.tsx                      → Transaction history
└── settings/
    └── page.tsx                      → Settings (future)
```

---

## Phase 5: Components

### Student Components (`components/admin/students/`)
| Component | Description |
|-----------|-------------|
| `StudentsTable.tsx` | Table with search input, status filter, sortable columns. Columns: Name, Email, Phone, Active Sub, Rayo Points, Status, Actions |
| `StudentForm.tsx` | Create/edit form: name, email, phone, notes, isActive |
| `StudentProfile.tsx` | Profile view with tabs: Overview, Attendance, Subscriptions, Transactions |
| `StudentStats.tsx` | Stats cards: total classes, active sub details, Rayo points with thunder icon |

### Attendance Components (`components/admin/attendance/`)
| Component | Description |
|-----------|-------------|
| `AttendanceRecorder.tsx` | Main recorder: date picker → schedule for that day → select class → searchable student list with checkboxes → submit |
| `ClassSelector.tsx` | Shows today's schedule (from data/schedule.ts), click to select a class |
| `StudentCheckList.tsx` | Searchable list of active students with checkboxes, shows subscription status |
| `AttendanceHistory.tsx` | Table of past classes with attendance counts |

### Subscription Components (`components/admin/subscriptions/`)
| Component | Description |
|-----------|-------------|
| `SubscriptionsTable.tsx` | List with filters: active/expired/all. Shows: student, package, lessons/week, expires, status |
| `SubscriptionForm.tsx` | Create form: select student (search), select package, amount, payment method. Creates subscription + transaction together |

### Transaction Components (`components/admin/transactions/`)
| Component | Description |
|-----------|-------------|
| `TransactionsTable.tsx` | Transaction list with date range filter, type filter. Shows: date, student, amount, type, method |

### Dashboard Components (`components/admin/dashboard/`)
| Component | Description |
|-----------|-------------|
| `DashboardStats.tsx` | Stats cards: Total Students, Active Subscriptions, Revenue This Month, Classes This Month |
| `RecentActivity.tsx` | Recent transactions and attendance records |

---

## Phase 6: Rayo Points System

- **Earning**: +1 point per class attended (handled in `record-attendance.ts`)
- **Display**: Thunder icon (FaBolt) + point count on student profile and student list
- **Redemption**: Manual — admin creates a "points_redemption" transaction with negative amount, deducts points from student
- **Future**: Define point-to-discount conversion rates in settings

---

## Implementation Order

We'll implement in this order to build incrementally:

1. **Phase 0**: Quick fixes (engines field, rename Client→Student)
2. **Phase 1**: Database schema changes + generate
3. **Phase 2a**: Student server actions + updated student pages
4. **Phase 3**: Account linking in auth.ts
5. **Phase 4**: Admin routes structure + sidebar update
6. **Phase 2b**: Subscription & transaction server actions
7. **Phase 5a**: Subscription pages + forms
8. **Phase 2c**: Attendance server actions
9. **Phase 5b**: Attendance recording UI
10. **Phase 5c**: Student profile page with all tabs
11. **Phase 5d**: Dashboard stats
12. **Phase 6**: Rayo points display + redemption

---

## Key Files to Modify

| File | Change |
|------|--------|
| `package.json` | Remove engines field |
| `lib/db/schema.prisma` | Add 4 new models, rename Client→Student, add rayoPoints |
| `lib/auth.ts` | Update session callback for Student model + email-based linking |
| `components/admin/AdminSidebar.tsx` | New menu items |
| `server-actions/clients/*` | Rename to `server-actions/students/*` |
| `types/next-auth.d.ts` | No changes needed |
| `app/[locale]/admin/*` | All admin pages |
| `components/admin/*` | All admin components |

---

## Verification

After each phase:
1. `pnpm tsc --noEmit` — no TypeScript errors
2. `pnpm lint` — no new ESLint errors
3. Manual testing in browser: navigate admin routes, test CRUD operations
