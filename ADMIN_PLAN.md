# Salsa Rayo — Admin System Plan

> Everything the school needs to manage students, finances, and classes — plus a personal space for every dancer.

---

## Current Implementation Status

| Area | Status | Notes |
|------|--------|-------|
| Database schema | DONE | All models in `lib/db/schema.prisma` |
| Account linking (auth) | DONE | Email-based merging in `lib/auth.ts` |
| Admin sidebar nav | DONE | Full nav in `lib/admin/config.ts` |
| Student CRUD | DONE | Server actions + table + dialog |
| Student profile page (tabs) | TODO | Overview, Attendance, Subscriptions, Transactions tabs |
| Dashboard stats | TODO | Currently minimal |
| Attendance system | TODO | Server actions + recording UI |
| Subscriptions management | TODO | Server actions + pages |
| Income tracking | TODO | Server actions + pages |
| Expenses tracking | TODO | Server actions + pages |
| Reports & analytics | TODO | Charts, exports |
| Settings | TODO | Rayo Points config, schedule, instructors, media |
| Promo codes UI | TODO | Model exists, no UI |
| Automated reminders | TODO | Email notifications |
| Student-facing features | TODO | My Account, Class Booking, Leaderboard |

---

# Part 1: Admin Panel

## Admin Navigation (Left Sidebar) — DONE

| Icon | Section | Route |
|------|---------|-------|
| IoHome | **Dashboard** | `/admin` |
| IoCalendar | **Schedule** | `/admin/schedule` |
| IoCheckboxOutline | **Attendance** | `/admin/attendance` |
| IoPeople | **Instructors** | `/admin/instructors` |
| IoSchool | **Students** | `/admin/students` |
| IoCard | **Subscriptions** | `/admin/subscriptions` |
| IoTrendingUp | **Income** | `/admin/income` |
| IoTrendingDown | **Expenses** | `/admin/expenses` |
| IoMdStats | **Reports** | `/admin/reports` |
| IoSettings | **Settings** | `/admin/settings` |

Config: `lib/admin/config.ts`

---

## Dashboard — TODO

The first screen the admin sees — a clean, visual dashboard built with stat cards.

### Stat Cards (top row)
Each card has an icon, a big number, a label, and a subtle trend indicator (e.g., +12% vs last month):

| Card | What It Shows |
|------|---------------|
| Total Students | All registered students |
| Active Subscriptions | Students with a valid subscription right now |
| Revenue This Month | Total income for the current month |
| Expenses This Month | Total expenses for the current month |
| Net Profit | Income minus expenses — green if positive, red if negative |
| Classes This Month | How many classes have been held so far |
| Avg. Attendance | Average students per class |

### Recent Activity (below the cards)
A live feed showing the latest events:
- New student registrations
- Subscription purchases and renewals
- Payments received
- Attendance records
- Rayo Points awarded

### Implementation
- **Server action**: `server-actions/dashboard/get-dashboard-stats.ts` — aggregate stats
- **Components**: `components/admin/dashboard/DashboardStats.tsx`, `RecentActivity.tsx`

---

## Students — PARTIALLY DONE

### Student List — DONE
Table with columns: Name, Email, Phone, Address, Sub Started, Sub Ending, Sub Status, Rayo Points.
- Search by name/email/phone
- Filter by subscription status
- Sort by name, registration date, Rayo Points
- Add Student dialog for quick registration

**Existing files:**
- `components/admin/students/StudentsTable.tsx`
- `components/admin/students/StudentDialog.tsx`
- `components/admin/students/columns.tsx`
- `components/admin/students/students-toolbar.tsx`
- `server-actions/students/get-students.ts`
- `server-actions/students/create-student.ts`
- `server-actions/students/update-student.ts`

### Student Detail Page — TODO
When the admin clicks on a student, they see a full profile with tabs:
- **Overview** — contact info, notes, Rayo Points balance, current subscription status card
- **Attendance** — every class this student attended, sorted by date
- **Subscriptions** — current and past packages with dates and amounts
- **Transactions** — full payment history for this student

The **Add Payment** button is always visible on the student's profile. It's the single entry point for all payments:
- Choose type: Subscription, Drop-in, Private Lesson, Workshop, or Other
- Enter amount, payment method, optional notes
- If Subscription is selected: also pick the package (Rayo 8/16/24/Custom) and optionally apply Rayo Points
- Everything is automatically linked to this student

### Quick Renew
When a student's subscription is expiring or expired, a **Renew** button appears. It pre-fills the same package, amount, and payment method from the last subscription — the secretary just confirms.

### Account Linking — DONE
The secretary can create a student without a Google account. If the student later logs in via Google, their accounts merge automatically based on email matching. If the student uses a different email, the secretary edits the student's email in the admin panel.

**Existing**: `lib/auth.ts` session callback handles email-based linking.

### Implementation (remaining)
- **Route**: `app/[locale]/admin/students/[id]/page.tsx`
- **Components**: `StudentProfile.tsx`, `StudentStats.tsx`
- **Server action**: `server-actions/students/get-student.ts` (single student with all relations)

---

## Attendance — TODO

### Recording Attendance (daily workflow)
Designed to be fast — the secretary's most frequent task:

1. **Pick a date** — defaults to today
2. **See that day's schedule** — the system shows classes for that day from `data/schedule.ts`
3. **Select a class** — tap the class to record
4. **Check off students** — searchable list with checkboxes; shows subscription status next to each name
5. **Submit** — attendance saved, +1 Rayo Point awarded to each student automatically

### Attendance History
- View past classes with attendance counts
- Click into a past class to see the full list
- Edit/correct past records (add/remove students)
- Rayo Points adjusted automatically on edits

### Implementation
- **Routes**: `app/[locale]/admin/attendance/page.tsx`, `record/page.tsx`
- **Server actions**: `server-actions/attendance/create-class.ts`, `record-attendance.ts`, `get-attendance.ts`, `get-classes.ts`
- **Components**: `AttendanceRecorder.tsx`, `ClassSelector.tsx`, `StudentCheckList.tsx`, `AttendanceHistory.tsx`

---

## Subscriptions — TODO

### Packages

| Package | Classes per Week | Duration |
|---------|-----------------|----------|
| Rayo 8  | 2 classes/week  | 30 days  |
| Rayo 16 | 4 classes/week  | 30 days  |
| Rayo 24 | 6 classes/week  | 30 days  |
| Custom  | Custom          | Custom   |

### Trial / Intro Package
- Free trial class or discounted short-term package (e.g., "Try 4 classes for 25 euros")
- Created as Custom subscription with a trial note
- Trial students tagged for follow-up

### Promo Codes
- Admin creates discount codes (e.g., "RAYO20") with % or fixed discount, optional expiry
- Applied when creating a subscription (in addition to or instead of Rayo Points)
- Usage tracking per code

### Subscriptions List Page
This screen is a **view/filter list** of all subscriptions (not where subscriptions are created):
- Filter by: active, expiring this week, expired, all
- Click any subscription to jump to that student's profile
- Deactivate button to manually end a subscription

### Implementation
- **Route**: `app/[locale]/admin/subscriptions/page.tsx`
- **Server actions**: `server-actions/subscriptions/create-subscription.ts`, `get-subscriptions.ts`, `deactivate-subscription.ts`
- **Components**: `SubscriptionsTable.tsx`, `SubscriptionForm.tsx`

---

## Income — TODO

All payments are created from the **student's profile** (Add Payment button), ensuring every payment is linked to a student. This screen is a **view/filter list** of all income records.

**Payment types** (chosen when adding a payment from a student's profile):
- **Subscription** — creates a subscription + payment together
- **Drop-in** — single class payment
- **Private lesson** — one-on-one lesson payment
- **Workshop** — special workshop or event fee
- **Other** — any custom payment

Each entry shows: amount, date, type, payment method (cash, card, bank transfer), linked student, notes.

**On this screen:**
- View all income records across all students
- Filter by: type, date range, payment method, student
- Click any entry to jump to that student's profile

> **Future**: Online payments via Stripe — students pay directly from the website.

### Implementation
- **Route**: `app/[locale]/admin/income/page.tsx`
- **Components**: `IncomeTable.tsx`

---

## Expenses — TODO

All money going out, with **custom categories defined by the admin**:

- Example categories: "Instructor Pay", "Venue Rent", "Equipment", "Music Licenses", "Marketing", "Utilities"
- Admin creates and manages categories directly in the Expenses screen
- Record any expense with: amount, date, category, payment method, notes

### Implementation
- **Route**: `app/[locale]/admin/expenses/page.tsx`
- **Server actions**: `server-actions/expenses/create-expense.ts`, `get-expenses.ts`, `manage-categories.ts`
- **Components**: `ExpensesTable.tsx`, `ExpenseForm.tsx`, `CategoryManager.tsx`

---

## Reports — TODO

### Analytics & Trends
- Revenue trends — income over time (weekly, monthly)
- Expense trends — spending over time by category
- Net profit/loss — income vs. expenses per period
- Attendance patterns — which days and classes are most popular
- Popular classes — ranked by average attendance
- Student retention — how many renew vs. leave
- Rayo Points summary — total points earned and redeemed
- Payment method breakdown — cash vs. card vs. bank transfer

### Export
- Download any report as CSV for accounting or record-keeping

### Implementation
- **Route**: `app/[locale]/admin/reports/page.tsx`
- **Components**: `RevenueChart.tsx`, `AttendanceChart.tsx`, `RetentionChart.tsx`, etc.

---

## Settings — TODO

Organized into groups:

| Group | What |
|-------|------|
| **Rayo Points** | Conversion rate (how many points = how many euros off) |
| **School Schedule** | Weekly class schedule (days, times, class names, levels) — reflected everywhere |
| **Instructors** | Manage instructor profiles (name, photo, bio), assign to classes |
| **Media Gallery** | Upload and manage photos/videos for the website |
| **Promo Codes** | Create, edit, deactivate codes; view usage stats |
| **Income Categories** | Add, edit, remove income types |
| **Automated Reminders** | Enable/disable reminder types |
| **School Info** | School name, address, contact details (future) |

### Implementation
- **Route**: `app/[locale]/admin/settings/page.tsx`

---

## Automated Reminders — TODO

| Trigger | When | Message |
|---------|------|---------|
| Subscription expiring | 7 days and 3 days before | "Your Rayo 16 expires in 3 days — renew to keep dancing!" |
| Subscription expired | 1 day after | "Your subscription has expired. Visit us to renew!" |
| Welcome message | After first registration | "Welcome to Salsa Rayo!" |
| Trial follow-up | 2 days after trial class | "How was your first class?" |
| Rayo Points milestone | When reaching reward threshold | "You've earned 100 Rayo Points! Redeem 10 euros off!" |
| Inactive student | After 30 days no attendance | "We miss you! Come back to the dance floor." |

---

# Part 2: Student-Facing Features — TODO

## Public Profile (visible to everyone)
- Username (chosen by student, only public name)
- Profile image (uploaded by student)
- Total lessons attended
- Rayo Points balance
- Dance stats — classes by style, attendance streak, member since

No personal info (name, email, phone) shown publicly.

### Privacy Toggle
Students can enable privacy mode:
- Public profile hidden ("This profile is private")
- Removed from leaderboard
- Admin data unaffected

**Existing partial**: `app/[locale]/(main)/profile/[id]/` exists with basic profile display.

## Leaderboard (nice to have)
Public page ranking most active dancers by total lessons attended. Shows username, image, lessons, Rayo Points, member since. Privacy-mode students excluded.

## Class Booking (from the website)
Students browse the schedule and book classes directly:
1. View schedule — all classes for the week
2. Click Book — registered for that class
3. Shows up in "Upcoming Classes" in student account
4. Secretary sees pre-checked bookings when recording attendance

Booking respects subscription limits — warning shown if weekly classes used up.

## My Account (private dashboard)
- Upcoming bookings
- Rayo Points balance + progress toward next reward
- Current subscription — package, expiry, classes remaining this week
- Attendance history
- Payment history
- Profile settings — edit username, upload/change image

> **Future**: Stripe integration for online subscription purchase/renewal.

---

# Rayo Points System

### Earning Points
| Action | Points |
|--------|--------|
| Attend a class | +1 per class (automatic) |
| Leave a 5-star Google review | Bonus (admin awards manually) |
| Refer a friend | Bonus (admin awards manually) |
| Special events | Bonus (admin awards manually) |

### Using Points
- Convert to discount on next subscription
- Conversion rate set by admin (e.g., 10 points = 1 euro off)
- Secretary applies discount when creating subscription, points deducted automatically

### Where Points Are Visible
- Student list (admin) — lightning bolt + number
- Student profile (admin) — full points history
- Public profile — lightning bolt + number
- My Account (student) — balance with progress toward next reward

### Rayo Points Management (admin)
From any student's profile:
- **Award points manually** — enter amount and reason, confirmation dialog
- **Redeem points** — apply discount when creating subscription, deducts automatically

---

# Real-Life Examples

## Example 1: Maria buys a Rayo 16 subscription

Maria walks in and wants to sign up for 4 classes per week.

**Secretary does:**
1. Students > searches "Maria" > clicks profile
2. Clicks **Add Payment**
3. Type: **Subscription** > picks **Rayo 16** (4 classes/week, 30 days)
4. Amount: 80 euros, payment: **Cash**
5. Maria has 50 Rayo Points > applies as discount (50 points = 5 euros off > pays 75 euros)
6. Clicks **Confirm**

**System does automatically:**
- Creates active subscription (expires in 30 days)
- Records 75 euro payment under Income (Subscription), linked to Maria
- Deducts 50 Rayo Points from Maria's balance
- Status badge: green "Active — Rayo 16"

**What if Maria attends a 5th class in one week?**
- Secretary sees: "Active — Rayo 16 (0 left this week)"
- Secretary can still check her in — system doesn't block
- Warning appears, secretary decides: let in free, charge drop-in, or suggest upgrade

## Example 2: Giorgos comes for a single drop-in class

**Secretary does:**
1. Students > "Giorgos" > clicks profile
2. Add Payment > type: **Drop-in** > 12 euros, Cash > Confirm
3. Attendance > tonight's Bachata 1 > checks Giorgos > Submit

**System does:** Records attendance, +1 Rayo Point, 12 euros in Income under "Drop-in"

## Example 3: Subscription status badges across the system

| Student | Badge | Meaning |
|---------|-------|---------|
| Maria | Active — Rayo 16 (3 left) | Active, can attend |
| Dimitris | Active — Rayo 8 (0 left) | Active but used all weekly classes |
| Sofia | Expiring — 3 days left | Still valid, expiring soon |
| Nikos | Expired — Feb 20 | Needs renewal |
| Giorgos | No subscription | Can attend as drop-in |

Badges are informational — secretary can still check in anyone.

---

# Who Uses What?

| Person | Access | Daily Tasks |
|--------|--------|-------------|
| **Secretary** | Full admin panel | Register students, record attendance, create subscriptions, log income/expenses |
| **Owner** | Full admin panel | Review dashboard, check reports, manage settings |
| **Student** | Website + My Account | View profile, check points, see attendance and subscription history |
| **Public visitor** | Website only | View student profiles, browse class schedule |

---

# Database Schema Reference

All models defined in `lib/db/schema.prisma`:
- `Student` — core student data + rayoPoints + relations
- `Subscription` — package, lessonsPerWeek, amountPaid, startDate, expiresAt
- `Transaction` — amount, type, paymentMethod, linked to student + optional subscription
- `DanceClass` — date, timeSlot, title, level, instructor
- `Attendance` — links DanceClass to Student (unique pair)
- `Expense` — amount, date, category, paymentMethod
- `ExpenseCategory` — name (unique)
- `PromoCode` — code, discountType, discountValue, expiresAt, usageCount

---

# Implementation Order (remaining work)

1. **Student detail page** — profile with tabs (Overview, Attendance, Subscriptions, Transactions) + Add Payment button
2. **Attendance system** — recording UI, class selector from schedule, student checklist, auto Rayo Points
3. **Subscription management** — create from student profile, subscriptions list page, deactivate
4. **Income page** — transaction list with filters
5. **Expenses page** — expense recording + category management
6. **Dashboard** — stat cards + recent activity feed
7. **Reports** — charts, trends, CSV export
8. **Settings** — Rayo Points config, schedule editor, promo codes management
9. **Student-facing** — My Account dashboard, class booking, leaderboard
10. **Automated reminders** — email notifications

---

*Built for Salsa Rayo — Athens' home of salsa, bachata, and Latin dance.*
