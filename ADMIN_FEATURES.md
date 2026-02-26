# Salsa Rayo — Platform Features

> Everything the school needs to manage students, finances, and classes — plus a personal space for every dancer.

---

# Part 1: Admin Panel

The admin panel is used by the secretary and the school owner to manage everything behind the scenes.

## Admin Navigation (Left Sidebar)

| Icon | Section | What's Inside |
|------|---------|---------------|
| Home | **Overview** | Dashboard stats, recent activity, quick actions |
| People | **Students** | Student list, search, registration, profiles |
| Calendar | **Attendance** | Record daily attendance, class history |
| CreditCard | **Subscriptions** | Active packages, renewals, expirations |
| TrendingUp | **Income** | All incoming payments by category |
| TrendingDown | **Expenses** | All outgoing costs, custom categories managed here |
| BarChart | **Reports** | Analytics, trends, CSV exports |
| Settings | **Settings** | Rayo Points, schedule, instructors, media gallery, income categories |

---

### Overview (Dashboard)

The first screen the admin sees after logging in — a clean, visual dashboard built with stat cards.

#### Stat Cards (top row)
Each card has an icon, a big number, a label, and a subtle trend indicator (e.g., +12% vs last month):

| Card | Example | What It Shows |
|------|---------|---------------|
| 👥 **Total Students** | 127 | All registered students |
| 🟢 **Active Subscriptions** | 84 | Students with a valid subscription right now |
| 💰 **Revenue This Month** | €4,320 | Total income for the current month |
| 📉 **Expenses This Month** | €1,850 | Total expenses for the current month |
| 📊 **Net Profit** | €2,470 | Income minus expenses — green if positive, red if negative |
| 📅 **Classes This Month** | 48 | How many classes have been held so far |
| 🔥 **Avg. Attendance** | 12.4 | Average students per class |

The cards are color-coded and designed to give the owner/secretary an instant snapshot without clicking anything.

#### Recent Activity (below the cards)
A live feed showing the latest events:
- New student registrations
- Subscription purchases and renewals
- Payments received
- Attendance records
- Rayo Points awarded

Each entry shows the time, student name, and what happened — keeping the admin in the loop at a glance.

---

### Students

#### Student List
A table of all students with:
- Name, email, phone, username
- Active subscription status (green badge if active, red if expired, gray if none)
- Rayo Points balance (lightning bolt icon + number)
- Active/Inactive status

#### Smart Search & Filters
- Search by name, email, phone, or username
- Filter by status (active, inactive, all)
- Sort by name, registration date, or Rayo Points

#### Easy Registration
The secretary can create a student directly — no need for the student to have an account yet. If the student later logs in via Google, their accounts merge automatically based on email.

If the student logs in with a different email than the one registered, the secretary can simply **edit the student's email** in the admin panel to match their Google account — the link happens automatically on the next login.

#### Student Detail Page
When the admin clicks on a student, they see a full profile with tabs:
- **Overview** — contact info, notes, Rayo Points balance, current subscription status
- **Attendance** — every class this student attended, sorted by date
- **Subscriptions** — current and past packages with dates and amounts
- **Transactions** — full payment history for this student

The **Add Payment** button is always visible on the student's profile. It's the single entry point for all payments:
- Choose type: Subscription, Drop-in, Private Lesson, Workshop, or Other
- Enter amount, payment method, optional notes
- If Subscription is selected: also pick the package (Rayo 8/16/24/Custom) and optionally apply Rayo Points
- Everything is automatically linked to this student

#### Quick Renew
When a student's subscription is expiring or expired, a **Renew** button appears on their profile. It pre-fills the same package, amount, and payment method from the last subscription — the secretary just confirms. One click to renew.

#### Rayo Points Management
From any student's profile, the admin can:
- **Award points manually** — enter an amount and reason, with a confirmation dialog ("Award 10 points to Maria?" → Confirm / Cancel)
- **Redeem points** — apply a discount when creating a new subscription, deducting points automatically

---

### Attendance

#### Recording Attendance (daily workflow)
Designed to be fast — the secretary's most frequent task:

1. **Pick a date** — defaults to today
2. **See that day's schedule** — the system automatically shows the classes for that day (e.g., Monday = Salsa Beginners 19:00, Bachata 1 20:00, Bachata 2 21:00)
3. **Select a class** — tap the class to record
4. **Check off students** — a searchable list of active students with checkboxes; shows each student's subscription status next to their name
5. **Submit** — attendance is saved and +1 Rayo Point is awarded to each student automatically

#### Dynamic Schedule
The class schedule is built into the system. The correct classes show for each day of the week — no manual setup needed. If the schedule changes, it's updated once and reflected everywhere.

#### Attendance History
- View past classes with attendance counts
- See which students attended any specific class
- Click into a past class to see the full list

#### Edit / Correct Attendance
Mistakes happen — the secretary can edit past attendance records:
- Add a student who was missed, or remove one who was checked in by mistake
- Every change is logged in an **audit trail**: who changed what, when, and why
- Rayo Points are adjusted automatically (added if a student is added, removed if deleted)

---

### Subscriptions

#### Subscription Packages

| Package | Classes per Week | Duration |
|---------|-----------------|----------|
| Rayo 8  | 2 classes/week  | 30 days  |
| Rayo 16 | 4 classes/week  | 30 days  |
| Rayo 24 | 6 classes/week  | 30 days  |
| Custom  | Custom          | Custom   |

#### Trial / Intro Package
For first-time students, the school can offer a special introductory deal:
- **Free trial class** — student attends one class for free to try the school
- **Intro package** — discounted short-term package (e.g., "Try 4 classes for €25")
- The admin creates these as a Custom subscription with a note marking it as a trial
- Trial students are tagged so the admin can follow up and convert them to regular subscribers

#### Promo Codes
The admin can create discount codes to share on social media, flyers, or in person:
- Each code has: a name (e.g., "RAYO20"), a discount (% or fixed €), and an optional expiry date
- When creating a subscription, the secretary can apply a promo code instead of (or in addition to) Rayo Points
- The system tracks how many times each code has been used
- Great for Instagram promotions, referral campaigns, or seasonal offers

#### Managing Subscriptions
- Subscriptions are created from the **student's profile** via Add Payment → Subscription (not from this screen)
- This screen is a **view/filter list** of all subscriptions across the school
- Filter by: active, expiring this week, expired, all
- Click any subscription to jump to that student's profile
- **Deactivate** — manually end a subscription if needed

---

### Income

All payments are created from the **student's profile** (Add Payment button), ensuring every payment is always linked to a student. This screen is a **view/filter list** of all income records.

**Payment types** (chosen when adding a payment from a student's profile):
- **Subscription** — creates a subscription + payment together
- **Drop-in** — single class payment
- **Private lesson** — one-on-one lesson payment
- **Workshop** — special workshop or event fee
- **Other** — any custom payment

Each income entry shows: amount, date, type, payment method (cash, card, bank transfer), linked student, and optional notes.

**On this screen:**
- View all income records across all students
- Filter by: type, date range, payment method, student
- Click any entry to jump to that student's profile

> **Future**: Online payments via Stripe — students will be able to pay for subscriptions directly from the website.

---

### Expenses

All money going out of the school, with **custom categories defined by the admin**:

- Example categories: "Instructor Pay", "Venue Rent", "Equipment", "Music Licenses", "Marketing", "Utilities"
- The admin creates and manages categories **directly in the Expenses screen** — no need to go to Settings
- Add, rename, or remove categories on the fly
- Record any expense with: amount, date, category, payment method, and notes

---

### Reports

#### Analytics & Trends
- **Revenue trends** — income over time (weekly, monthly)
- **Expense trends** — spending over time by category
- **Net profit/loss** — income vs. expenses per period
- **Attendance patterns** — which days and classes are most popular
- **Popular classes** — ranked by average attendance
- **Student retention** — how many students renew vs. leave
- **Rayo Points summary** — total points earned and redeemed across all students
- **Payment method breakdown** — cash vs. card vs. bank transfer

#### Export
- Download any report as CSV for accounting or record-keeping

---

### Settings

Organized into groups:

**Rayo Points**
- Conversion rate — how many points = how many euros off (e.g., 10 points = €1)

**School Schedule**
- View and edit the weekly class schedule (days, times, class names, levels)
- Changes here are reflected everywhere: the website, the attendance recording screen, reports

**Instructors**
- Manage instructor profiles (name, photo, bio)
- Assign instructors to classes in the schedule

**Media Gallery**
- Upload and manage photos/videos for the website
- Organize by event, class, or category

**Promo Codes**
- Create, edit, and deactivate discount codes
- View usage stats per code (how many times used, total discount given)

**Income Categories**
- Add, edit, or remove income types (subscription, drop-in, workshop, etc.)

**Automated Reminders**
- Enable/disable each reminder type
- Future: customize message templates

**School Info**
- School name, address, contact details (future)

---

### Automated Reminders

The system sends automatic notifications to students via email (and future: SMS/push):

| Trigger | When | Message |
|---------|------|---------|
| **Subscription expiring** | 7 days and 3 days before expiry | "Your Rayo 16 expires in 3 days — renew to keep dancing!" |
| **Subscription expired** | 1 day after expiry | "Your subscription has expired. Visit us to renew!" |
| **Welcome message** | After first registration | "Welcome to Salsa Rayo! Here's what to expect at your first class." |
| **Trial follow-up** | 2 days after trial class | "How was your first class? Ready to join the Rayo family?" |
| **Rayo Points milestone** | When reaching a reward threshold | "You've earned 100 Rayo Points! You can redeem €10 off your next subscription." |
| **Inactive student** | After 30 days with no attendance | "We miss you! Come back to the dance floor." |

- The admin can enable/disable each reminder type from Settings
- Reminders are sent automatically — no manual action needed
- Future: customizable message templates

---

# Part 2: What Students See

Students who create an account (via Google login) get their own personal space on the Salsa Rayo website.

## Public Profile (visible to everyone)

Every student has a public profile page that anyone can visit:

- **Username** — chosen by the student (the only name shown publicly)
- **Profile image** — uploaded by the student
- **Total lessons attended** — how many classes they've been to
- **Rayo Points balance** — lightning bolt icon with their points
- **Dance stats** — classes by style (e.g., 45 Salsa, 30 Bachata), attendance streak, member since date

No personal information (real name, email, phone) is shown publicly — only the username and image.

### Privacy Toggle
Students can enable **privacy mode** from their profile settings. When privacy is on:
- Their public profile is **hidden** — visiting the URL shows "This profile is private"
- They are **removed from the leaderboard**
- Their data still exists in the admin panel — privacy only affects public visibility

By default, profiles are public. The student can toggle privacy on/off at any time.

## Leaderboard (nice to have)

A public page on the website showcasing the most active dancers:

| Rank | Student | Lessons | Rayo Points | Member Since |
|------|---------|---------|-------------|-------------|
| 1 | ⚡ DancerMaria | 142 | 98 | Jan 2024 |
| 2 | ⚡ SalsaNikos | 128 | 76 | Mar 2024 |
| 3 | ⚡ BachataKing | 115 | 63 | Feb 2024 |

- Rankings based on **total lessons attended**
- Shows: username, profile image, total lessons, Rayo Points, member since
- Clicking a name goes to that student's public profile
- Students with **privacy mode enabled** are automatically excluded
- Encourages friendly competition and motivates regular attendance

## Class Booking (from the website)

Students can browse the weekly schedule on the website and **book a class** directly:

1. View the schedule — see all classes for the week with day, time, style, level, and instructor
2. Click **Book** on any class — the student is registered for that class
3. The booking shows up in the student's account under "Upcoming Classes"
4. The secretary sees the bookings in the admin panel when recording attendance — pre-checked students who booked online

**How it connects to the admin:**
- When the secretary opens the Attendance screen, students who booked online are already checked off
- The secretary can still add/remove students manually (walk-ins, no-shows)
- Booking respects the student's subscription limits — if they've used all weekly classes, a warning is shown before booking

This makes it easier for students to plan their week and for the secretary to know who's coming.

## My Account (private, only the student sees)

When a student logs in, they see their personal dashboard:

- **Upcoming bookings** — classes they've booked for the week
- **Rayo Points balance** — lightning bolt icon with current points and how close they are to their next reward
- **Current subscription** — package name, expiry date, classes remaining this week
- **Attendance history** — every class they've attended, organized by date
- **Payment history** — all past transactions
- **Profile settings** — edit username, upload/change profile image

Students can edit their **username**, **profile image**, and **manage their bookings** (book or cancel upcoming classes).

> **Future**: With Stripe integration, students will also be able to purchase and renew subscriptions directly from their account.

---

# Rayo Points — How They Work

### Earning Points
| Action | Points |
|--------|--------|
| Attend a class | +1 per class |
| Leave a 5-star Google review | Bonus (admin awards manually) |
| Refer a friend | Bonus (admin awards manually) |
| Special events | Bonus (admin awards manually) |

### Using Points
- Points convert to a **discount on the next subscription**
- The conversion rate is set by the admin (e.g., 10 points = €1 off)
- When renewing, the secretary applies the discount and the points are deducted

### Where Points Are Visible
- **Student list** (admin) — lightning bolt + number next to each student
- **Student profile** (admin) — full points history
- **Public profile** — lightning bolt + number visible to everyone
- **My Account** (student) — points balance with progress toward next reward

---

# Real-Life Examples

## Example 1: Maria buys a Rayo 16 subscription

Maria walks in and wants to sign up for 4 classes per week.

**What the secretary does:**
1. Goes to **Students** → searches "Maria" → clicks on her profile
2. Clicks **Add Payment**
3. Chooses payment type: **Subscription**
4. Picks **Rayo 16** (4 classes/week, 30 days)
5. Enters **€80**, payment method: **Cash**
6. Maria has 50 Rayo Points — the secretary applies them as a discount (50 points = €5 off → Maria pays **€75**)
7. Clicks **Confirm**

**What the system does automatically:**
- Creates an active subscription for Maria (expires in 30 days)
- Records a payment of €75 under Income (category: Subscription), **linked to Maria**
- Deducts 50 Rayo Points from Maria's balance
- Maria's status badge turns **green: "Active — Rayo 16"** everywhere in the system

**What Maria sees in her account:**
- Current subscription: Rayo 16 — expires March 28
- Classes remaining this week: 4
- Rayo Points: 0 (redeemed)
- Latest payment: €75 on Feb 26

**What if Maria only attends 3 classes this week?**
- The unused class does **not** roll over — each week resets to 4
- Her badge still shows 🟢 **Active — Rayo 16**
- No penalty, no refund — she simply didn't use her full allowance that week

**What if Maria tries to attend a 5th class this week?**
- The secretary sees her badge: 🟢 **Active — Rayo 16** (0 left this week)
- The secretary can **still check her in** — the system doesn't block attendance
- A subtle warning appears: "Maria has used all 4 classes for this week"
- It's up to the secretary/owner to decide: let her in for free, charge a drop-in fee, or ask her to upgrade to Rayo 24
- If they charge a drop-in, the secretary records it under Income like any other drop-in payment

---

## Example 2: Giorgos comes for a single drop-in class

Giorgos doesn't have a subscription — he just wants to try one Bachata class tonight.

**What the secretary does:**
1. Goes to **Students** → searches "Giorgos" → clicks on his profile
2. Clicks **Add Payment**
3. Chooses payment type: **Drop-in**
4. Enters **€12**, payment method: **Cash**
5. Clicks **Confirm**
6. Then goes to **Attendance** → selects tonight's Bachata 1 class → checks off Giorgos → submits

**What the system does automatically:**
- Records Giorgos's attendance for tonight's Bachata 1 class
- Awards +1 Rayo Point to Giorgos
- The €12 appears in Income under "Drop-in"

**What Giorgos sees in his account:**
- Attendance history: 1 class (Bachata 1 — Feb 26)
- Rayo Points: 1
- No active subscription
- Payment history: €12 drop-in

---

## Example 3: How validity looks across the system

The secretary opens the **Attendance** page to record tonight's Salsa Beginners class. The student checklist shows each student's status:

| Student | Status Badge | Meaning |
|---------|-------------|---------|
| Maria | 🟢 **Active — Rayo 16** (3 left this week) | Has an active subscription, can attend |
| Dimitris | 🟢 **Active — Rayo 8** (0 left this week) | Active subscription but used all weekly classes |
| Sofia | 🟡 **Expiring — 3 days left** | Subscription expires in 3 days — still valid tonight |
| Nikos | 🔴 **Expired — Feb 20** | Subscription expired 6 days ago — needs to renew |
| Giorgos | ⚪ **No subscription** | No subscription — can attend as drop-in |

The secretary can still check in **anyone** — the badges are informational. A student with 0 classes left or an expired subscription can still attend (and the secretary can have the renewal conversation in person).

### On the Student List page

The same badges appear in the main student table, so the admin can always see at a glance who's active, expiring, expired, or unsubscribed — without clicking into each profile.

### On the Student Profile page

The student's profile shows a clear status card at the top:

**If active:**
> 🟢 Rayo 16 — Active
> Expires: March 28 · 3 of 4 classes used this week
> Paid: €75 on Feb 26

**If expiring soon:**
> 🟡 Rayo 8 — Expiring in 3 days
> Expires: March 1 · 1 of 2 classes used this week

**If expired:**
> 🔴 Rayo 16 — Expired
> Expired: Feb 20 · Last active 6 days ago

**If no subscription:**
> ⚪ No active subscription
> Last subscription: Rayo 8 (expired Jan 15)

---

# Who Uses What?

| Person | Access | Daily Tasks |
|--------|--------|-------------|
| **Secretary** | Full admin panel | Register students, record attendance, create subscriptions, log income/expenses |
| **Owner** | Full admin panel | Review dashboard, check reports, manage settings |
| **Student** | Website + My Account | View profile, check points, see attendance and subscription history |
| **Public visitor** | Website only | View student public profiles, browse class schedule |

---

*Built for Salsa Rayo — Athens' home of salsa, bachata, and Latin dance.*
