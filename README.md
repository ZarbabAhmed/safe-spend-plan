# My Money Compass

You are building a premium, modern, mobile-first web application for personal money and budget management.

PROJECT TYPE:

Personal Finance / Budget Management Web App

WORKING PRODUCT NAME:

Use a temporary original name such as "Nisaab" only if needed.

Do not spend time on branding-name exploration right now.

The architecture must make renaming easy later.

==================================================

CORE PRODUCT PURPOSE

==================================================

This is NOT a banking application.

This is NOT a wallet.

This is NOT a payment application.

This is NOT a money-transfer application.

This is NOT an accounting application.

The application must NEVER imply that it stores, transfers, sends, receives, or processes the user's real money.

The user's actual money remains in their bank account, cash, or other real-world account.

This application is a PERSONAL MONEY CONTROL SYSTEM.

The application helps users:

- understand their monthly income

- plan their monthly money

- create a realistic budget

- record expenses

- see how much they have already spent

- see what remains

- know how much is safe to spend

- maintain savings

- maintain an emergency/safety fund

- create financial goals

- track progress toward goals

- estimate how long a goal will take

- review each month

- make better spending decisions

CORE PRODUCT PROMISE:

"Know what you can safely spend today without hurting tomorrow."

CORE PRODUCT LOOP:

EARN

→ PLAN

→ SPEND

→ TRACK

→ SAVE

→ ACHIEVE

→ REVIEW

==================================================

PRIMARY V1 TARGET USER

==================================================

The primary V1 user is a monthly salaried/job-holding person.

Typical user:

- receives a monthly salary

- has relatively predictable income

- has rent

- has bills

- has food expenses

- has travel expenses

- has personal expenses

- wants to save

- has future purchases

- has financial goals

- often spends too much early in the month

- wants to know what can safely be spent today

- wants to know how many months are needed to reach a goal

The product should be especially useful for someone who says:

"I get my salary, I start spending, and halfway through the month I don't know where my money went."

==================================================

BUSINESS USER

==================================================

Allow the architecture to support:

Job Holder

Business Owner

But optimize V1 primarily for Job Holders.

Business mode must remain logically separate from personal finance.

Do not mix:

Business Revenue

Business Expenses

Personal Income

Do not build advanced business accounting in V1.

==================================================

DESIGN DIRECTION

==================================================

IMPORTANT:

The visual direction must NOT be green-led.

Use a premium PURPLE / VIOLET / BLUE / TURQUOISE fintech aesthetic.

The visual direction is INSPIRED by premium fintech products such as Raqami, but MUST remain an original design.

Do NOT copy:

- Raqami logo

- Raqami brand

- Raqami illustrations

- Raqami exact layouts

- Raqami exact components

- Raqami exact wording

- Raqami proprietary assets

- Raqami exact page structure

Borrow only high-level design qualities:

- premium fintech feel

- smooth modern interface

- confident typography

- strong hierarchy

- clean cards

- beautiful gradients

- elegant rounded surfaces

- high-quality animations

- simple interaction patterns

- strong financial numbers

- trustworthy appearance

- low visual clutter

==================================================

COLOR DIRECTION

==================================================

Primary visual family:

PURPLE / VIOLET

Use a refined palette approximately inspired by this direction:

Primary Purple:

#6F4DD5

Deep Purple:

#5635B8

Secondary Violet:

#8568E8

Soft Violet:

#EDE9FF

Accent Blue:

#5F8FEF

Accent Turquoise:

#48C7C3

Light Background:

#F7F7FB

Card Surface:

#FFFFFF

Primary Text:

#15151C

Secondary Text:

#70707C

Success:

#24B47E

Warning:

#E7A63B

Danger:

#E05252

Dark Background:

#101014

Dark Surface:

#18181E

Dark Elevated Surface:

#21212A

IMPORTANT:

Purple is the dominant brand color.

Turquoise and blue are supporting accents.

Do not create a green UI.

Do not use too many colors.

Use semantic colors consistently.

SUCCESS = positive progress / savings / healthy budget

WARNING = approaching limit

DANGER = over budget

NEUTRAL = standard information

Color must never be the only way important information is communicated.

==================================================

GRADIENT SYSTEM

==================================================

Use elegant fintech gradients.

Preferred directions:

Purple → Violet

Purple → Blue

Blue → Turquoise

Gradients should appear mainly in:

- hero cards

- selected states

- progress moments

- onboarding visual moments

- CTA accents

- empty/welcome illustrations

Do NOT use gradients everywhere.

White space and neutral surfaces should dominate supporting areas.

==================================================

TYPOGRAPHY

==================================================

Use a modern premium sans-serif type system.

Primary goal:

- excellent readability

- premium fintech feel

- strong numbers

- clean labels

- excellent mobile readability

Preferred font family direction:

Manrope

or

Plus Jakarta Sans

or

Inter

Choose one primary family and use it consistently.

Do not use decorative display fonts.

Money values should be visually strong.

Examples:

Rs. 150,000

Rs. 18,400

64%

9 months

Use strong font weight for financial metrics.

Headings:

bold / semi-bold

Body:

regular / medium

Labels:

medium

==================================================

VISUAL PERSONALITY

==================================================

The interface should feel:

PREMIUM

MODERN

CALM

FRIENDLY

SMART

TRUSTWORTHY

MOTIVATING

SIMPLE

The user should feel:

"I finally understand my money."

NOT:

"I am using accounting software."

==================================================

UX PHILOSOPHY

==================================================

NON-NEGOTIABLE UX RULES:

1. One primary action per screen.

2. Minimize data entry.

3. Progressive disclosure.

4. Do not interrogate the user.

5. Do not overwhelm users with financial terminology.

6. The application should calculate things automatically.

7. The user should make decisions, not calculations.

8. Important actions should be immediately accessible.

9. Secondary actions should be less prominent.

10. Never shame a user for overspending.

11. Every expense should update the user's financial picture.

12. Every goal should answer:

   "How far am I?"

13. Every budget should answer:

   "How much can I spend?"

14. The dashboard should answer the user's most important financial questions immediately.

15. The app should feel rewarding to use.

==================================================

APPLICATION STRUCTURE

==================================================

Create the following primary areas:

HOME

BUDGET

TRANSACTIONS

GOALS

PROFILE

Secondary flows:

INCOME

SAVINGS

EMERGENCY FUND

MONTHLY REVIEW

SETTINGS

SECURITY

Primary bottom navigation on mobile:

Home

Budget

Transactions

Goals

Profile

Desktop:

Use a clean left navigation or compact responsive sidebar while preserving the same information architecture.

==================================================

COMPLETE USER FLOW

==================================================

NEW USER FLOW:

Splash / Loading

→ Welcome / Landing

→ Terms & Privacy Agreement

→ Sign Up / Log In

→ Verification

→ Create PIN

→ Welcome Setup

→ User Type

→ Income Setup

→ Fixed Expenses

→ Variable Expenses

→ Savings

→ Emergency Fund

→ First Goal

→ Budget Generation

→ Budget Ready

→ Guided Dashboard

→ Normal Dashboard

RETURNING USER FLOW:

Loading

→ Session Check

→ Home Dashboard

If authenticated:

Go directly to Home.

If session expired:

→ Login

==================================================

SCREEN 01 — SPLASH / LOADING

==================================================

Create a premium minimal loading screen.

Requirements:

- original product logo/mark

- subtle purple gradient background

- small elegant loading animation

- no unnecessary text

- fast and premium

Do not make a banking-style splash screen.

==================================================

SCREEN 02 — WELCOME / LANDING

==================================================

Hero message:

"Know what you can safely spend today without hurting tomorrow."

Supporting line:

"Plan your money. Track your spending. Build your future."

Visual:

Create a beautiful illustrative/dashboard preview showing:

Safe to Spend

Income

Spent

Savings

Goal Progress

This data is DEMO DATA only.

Make it clear that this is a product preview.

Primary CTA:

Get Started

Secondary CTA:

Log In

The landing page should visually communicate the value in seconds.

==================================================

SCREEN 03 — TERMS & AGREEMENT

==================================================

Before account creation, show:

Terms & Conditions

Privacy Policy

Data usage summary

Financial disclaimer

Use clear plain language.

Agreement control:

[ ] I agree to the Terms & Conditions and Privacy Policy.

Primary CTA:

Continue

Provide links to full documents.

Do not overwhelm the user.

==================================================

SCREEN 04 — SIGN UP / LOGIN

==================================================

Create a polished authentication experience.

Sign Up options:

Continue with Google

Continue with Email

Continue with Phone

Login options:

Phone / Email

Password or OTP

Forgot Password

For phone flow:

Phone Number

→ OTP

→ Create App PIN

Keep authentication simple.

Do not implement banking-style KYC because this is not a bank.

==================================================

SCREEN 05 — OTP

==================================================

Premium OTP screen.

Fields:

6 digit OTP

Features:

Auto focus

Paste support

Resend countdown

Resend OTP

Change number

Success:

Continue

==================================================

SCREEN 06 — CREATE APP PIN

==================================================

Create a 4 or 6 digit app PIN.

Confirm PIN.

Optional:

Enable biometric unlock

Biometric should be optional and architecture-ready, not mandatory on web.

==================================================

SCREEN 07 — ONBOARDING WELCOME

==================================================

Headline:

"Let's build your money plan."

Supporting line:

"It only takes a few steps. You can change anything later."

CTA:

Let's Start

Progress indicator:

Step 1 of X

==================================================

SCREEN 08 — USER TYPE

==================================================

Question:

"What best describes you?"

Cards:

Job Holder

Business Owner

Job Holder is the recommended / visually primary V1 path.

==================================================

SCREEN 09 — INCOME

==================================================

For Job Holder:

Monthly Salary

Salary Date

Additional Income (optional)

Example:

Rs. 150,000

Salary date:

1st

Do not ask unnecessary personal financial questions.

==================================================

SCREEN 10 — FIXED EXPENSES

==================================================

Title:

"Your monthly commitments"

Categories:

Rent

Electricity

Internet

Phone

Education

Loan / Installment

Subscriptions

Other

Allow:

Add custom category

Skip optional categories

Do not require every field.

==================================================

SCREEN 11 — VARIABLE EXPENSES

==================================================

Categories:

Food

Travel

Shopping

Entertainment

Personal

Other

Allow estimation.

Provide:

"I don't know — estimate for me"

Do not block onboarding because the user doesn't know exact numbers.

==================================================

SCREEN 12 — SAVINGS

==================================================

Question:

"How much would you like to save every month?"

Example:

Rs. 30,000

Show visual preview of how this affects their budget.

==================================================

SCREEN 13 — EMERGENCY / SAFETY FUND

==================================================

Question:

"How much would make you feel financially safe?"

Target:

Rs. 300,000

Current:

Rs. 75,000

Show:

41.6% complete

Keep language supportive and non-judgmental.

==================================================

SCREEN 14 — FIRST GOAL

==================================================

Question:

"What are you saving for?"

Options:

Car

Laptop

Phone

Business

Travel

Home

Education

Custom

Then:

Goal Name

Target Amount

Current Saved

Target Date

==================================================

SCREEN 15 — BUDGET GENERATION

==================================================

Create a major visual "WOW" moment.

Headline:

"Your money plan is ready."

Show:

Income

Fixed Expenses

Variable Budget

Savings

Goal Contribution

Flexible Money

Animate numbers smoothly.

CTA:

View My Plan

==================================================

SCREEN 16 — FIRST DASHBOARD GUIDE

==================================================

The first dashboard visit must show a short guided tour.

Do NOT create a long tutorial.

Maximum 4-5 steps.

Step 1:

Safe to Spend

Step 2:

Budget

Step 3:

Transactions

Step 4:

Savings / Goals

Step 5:

Add Expense

Include:

Skip Tour

and:

Got it

After completion, never show the tour automatically again unless the user requests help.

==================================================

SCREEN 17 — HOME DASHBOARD

==================================================

This is the MOST IMPORTANT SCREEN.

The dashboard must immediately answer:

1. How much came in?

2. How much have I spent?

3. How much have I saved?

4. How much can I safely spend?

5. What am I working toward?

==================================================

DASHBOARD HEADER

==================================================

Show:

User name

Current month

Month selector

Notifications

Profile/avatar

Greeting:

"Good morning, [Name]"

==================================================

DASHBOARD HERO

==================================================

Primary feature:

SAFE TO SPEND

Example:

Rs. 18,400

Supporting text:

"Based on your current spending and upcoming commitments."

Status:

You're on track

This must be the most visually important financial metric.

==================================================

MONEY SNAPSHOT

==================================================

Income

Rs. 150K

Spent

Rs. 91K

Saved

Rs. 32K

Remaining

Rs. 27K

Use elegant visual hierarchy.

==================================================

BUDGET HEALTH

==================================================

Show key categories:

Food

Travel

Bills

Personal

Example:

Food

Rs. 14K / Rs. 20K

Travel

Rs. 7K / Rs. 10K

Use progress meters.

Status labels:

On track

Getting close

Over budget

==================================================

SAVINGS CARD

==================================================

Monthly savings target:

Rs. 30K

Actual:

Rs. 32K

Status:

Target exceeded

Provide subtle positive motion.

==================================================

GOAL CARD

==================================================

Example:

Car Goal

64%

Rs. 640K / Rs. 1M

9 months remaining

CTA:

View Goal

==================================================

RECENT TRANSACTIONS

==================================================

Show latest 3-5 transactions.

CTA:

View All

==================================================

PRIMARY ACTION

==================================================

Use a highly visible:

+ Add Expense

This should be the easiest action to access from the dashboard.

==================================================

SCREEN 18 — BUDGET

==================================================

Show current month.

Header:

August 2026

Show:

Income

Planned

Actual

Remaining

Categories:

Housing

Food

Travel

Bills

Savings

Goals

Flexible

Clearly distinguish:

PLANNED

ACTUAL

REMAINING

Allow budget editing.

==================================================

SCREEN 19 — WEEKLY SPENDING

==================================================

Inside Budget:

This Week

Safe to Spend:

Rs. 12,500

Spent:

Rs. 8,100

Remaining:

Rs. 4,400

Provide simple status.

Positive:

"You're within your weekly plan."

Warning:

"You're spending faster than planned."

Do not shame the user.

==================================================

SCREEN 20 — ADD EXPENSE

==================================================

Open as a premium bottom sheet on mobile and modal/drawer on desktop.

Fields:

Amount

Category

Date

Payment Method

Optional Note

Categories:

Food

Travel

Rent

Bills

Shopping

Entertainment

Personal

Other

Primary CTA:

Save Expense

After save:

Update:

Spent

Category remaining

Monthly remaining

Safe to Spend

Relevant projections

Success animation:

"Expense added"

==================================================

SCREEN 21 — ADD INCOME

==================================================

Types:

Salary

Bonus

Freelance

Other

After save:

Recalculate:

Income

Budget

Remaining

Safe to Spend

Savings

Goal projection

For significant extra income, optionally show:

"How would you like to use this extra money?"

Options:

Save

Emergency Fund

Goal

Spend

Split

This must remain optional.

==================================================

SCREEN 22 — TRANSACTIONS

==================================================

Create a beautiful transaction timeline.

Group:

Today

Yesterday

This Week

Earlier

Each row:

Icon

Title

Category

Date

Amount

Provide:

Search

Filter

Date

Category

Income / Expense

Make transaction scanning extremely fast.

==================================================

SCREEN 23 — GOALS

==================================================

Show active goals as visual cards.

Examples:

Car

MacBook

Business Capital

Travel

Each card:

Goal name

Progress %

Saved

Target

Estimated completion

CTA:

+ Create Goal

==================================================

SCREEN 24 — GOAL DETAIL

==================================================

Show:

Goal name

Target

Saved

Remaining

Monthly contribution

Estimated completion

Example:

MacBook

Target:

Rs. 450K

Saved:

Rs. 180K

Remaining:

Rs. 270K

Monthly Contribution:

Rs. 30K

Estimated Completion:

9 months

==================================================

SCREEN 25 — GOAL MILESTONES

==================================================

Inside Goal Detail.

Example:

Rs. 100K ✓

Rs. 150K ✓

Rs. 250K

Rs. 350K

Rs. 450K

Allow user-defined milestones later.

Keep this visually motivating but not childish.

==================================================

SCREEN 26 — SAVINGS

==================================================

Show:

Monthly Savings

Emergency Fund

Goal Contributions

Clearly distinguish:

Savings

Emergency Fund

Goal Money

Do not turn this into an investment app.

==================================================

SCREEN 27 — EMERGENCY FUND

==================================================

Show:

Target

Current

Remaining

Progress

Estimated completion

Example:

Rs. 125K / Rs. 300K

41.6%

Keep tone supportive.

==================================================

SCREEN 28 — MONTHLY REVIEW

==================================================

At the end of each month:

Income

Spent

Saved

Goal Contribution

Show:

Budget Health

Savings Progress

Category performance

Goal progress

Example:

Food:

18% over budget

Travel:

On target

Savings:

Target achieved

Goal:

On track

End with:

"Here's how next month can be better."

==================================================

SCREEN 29 — MONTH SELECTOR / MONTHLY HISTORY

==================================================

Allow user to switch between months.

Examples:

August 2026

July 2026

June 2026

Preserve monthly history.

Month switching must be quick and obvious.

==================================================

MONTHLY CYCLE

==================================================

The application must support:

Current Month

→ Month Complete

→ Monthly Review

→ Next Month Plan

→ recurring commitments continue

→ savings goals continue

→ goal progress continues

Do not duplicate data unnecessarily.

==================================================

SCREEN 30 — PROFILE

==================================================

Show:

Name

Email / Phone

Profile type

Currency

Account settings

Security

Notifications

Budget preferences

==================================================

SCREEN 31 — SECURITY

==================================================

Include:

Change PIN

Biometric readiness

Active sessions

Logout

Delete account

==================================================

SCREEN 32 — SETTINGS

==================================================

Include:

Currency

Categories

Budget preferences

Notification preferences

Theme

Dark mode / Light mode

Privacy

Terms

Account deletion

==================================================

EMPTY STATES

==================================================

Design custom empty states for:

No transactions

No goals

No savings

No budget

No monthly data

Each empty state should explain:

WHAT THIS AREA IS FOR

WHAT THE USER CAN DO NEXT

Example:

"No goals yet."

"Give your savings something to work toward."

CTA:

Create Goal

==================================================

LOADING STATES

==================================================

Create polished skeleton loaders.

Use motion subtly.

Avoid spinner overload.

==================================================

ERROR STATES

==================================================

Create:

Validation error

Network error

Server error

Authentication error

Session expired

Failed transaction save

Failed budget calculation

Every error must explain what happened and what the user can do.

==================================================

SUCCESS STATES

==================================================

Examples:

Expense added

Income added

Goal created

Savings added

Budget updated

Profile updated

Use small elegant animations.

==================================================

FINANCIAL LOGIC

==================================================

The architecture must support:

Total Income

-

Fixed Expenses

-

Variable Budget

-

Savings Allocation

-

Goal Allocation

=

Flexible Money

Actual expenses reduce:

Category Remaining

Monthly Remaining

Safe to Spend

Additional income increases:

Income

Potential Flexibility

Safe to Spend

Goal contributions increase:

Goal Progress

Savings increase:

Savings Progress

==================================================

SAFE TO SPEND

==================================================

This is one of the CORE PRODUCT FEATURES.

Safe to Spend must NOT simply equal current account balance.

Conceptually it should consider:

Current tracked available money

+

remaining planned flexibility

-

upcoming planned commitments

-

required savings

-

planned goal contributions

-

relevant current-period spending

The exact financial formula must remain modular so it can be refined later without redesigning the UI.

Display:

SAFE TO SPEND

not:

BANK BALANCE

The user should understand:

"I have this much room to spend without damaging my plan."

==================================================

IMPORTANT EDGE CASES

==================================================

Support UX for:

Overspending

Bonus income

Unexpected expense

Missing savings target

Salary change

Editing transaction

Deleting transaction

Changing budget

Changing goal contribution

Changing goal target date

Month rollover

No activity

First month

Incomplete onboarding

Do not shame users.

==================================================

OVESPENDING UX

==================================================

Example:

Food budget:

Rs. 20K

Actual:

Rs. 24K

Show:

"You're Rs. 4,000 over your food budget."

Provide optional action:

Adjust Budget

Do not use aggressive warning language.

==================================================

EXTRA INCOME UX

==================================================

If user receives bonus:

Example:

Salary:

Rs. 150K

Bonus:

Rs. 30K

Show optional suggestion:

"You've received extra income."

Options:

Save

Emergency Fund

Goal

Spend

Split

No forced interaction.

==================================================

MONTHLY CARRY FORWARD

==================================================

Architecture must support carrying actual leftover money into the next month.

Budget plans and recurring commitments must be treated separately from actual cash movement.

Keep this logic modular.

==================================================

MOTION SYSTEM

==================================================

Motion should feel premium and fast.

Use:

- number count-up

- progress animation

- card fade/slide

- smooth bottom sheets

- subtle page transitions

- success animations

- month transition

- budget meter updates

Avoid:

- excessive bounce

- childish confetti

- excessive 3D

- distracting effects

Animation must communicate change, not decoration.

==================================================

DARK MODE

==================================================

Create a complete dark theme from the beginning.

Dark theme:

Deep charcoal

Dark elevated surfaces

Purple/violet accents

Blue/turquoise secondary accents

High contrast text

Controlled borders

Do not simply invert the light mode.

Both themes must feel equally premium.

==================================================

RESPONSIVE WEB DESIGN

==================================================

Build mobile-first.

Primary target:

Modern smartphone viewport.

Also support:

Tablet

Desktop

Mobile must feel like a true mobile product, not a shrunken desktop site.

Use:

- large touch targets

- bottom navigation

- bottom sheets

- readable numbers

- minimal typing

- thumb-friendly actions

Desktop can use:

- left sidebar

- wider cards

- multi-column dashboard

- larger data areas

Maintain the same product logic across breakpoints.

==================================================

ACCESSIBILITY

==================================================

Include:

Good contrast

Readable font size

Keyboard accessibility

Visible focus states

Clear labels

Semantic hierarchy

Accessible form errors

Icons paired with labels when necessary

No color-only status communication

==================================================

SECURITY

==================================================

This app contains sensitive financial information.

Use secure authentication architecture.

Support:

Phone OTP

Email authentication

Secure session handling

App PIN architecture

Biometric readiness

Logout

Account deletion

Never present the product as a bank.

Never claim bank-grade security unless actually implemented.

==================================================

DESIGN SYSTEM

==================================================

Create reusable:

Buttons

Inputs

Cards

Progress bars

Budget meters

Goal cards

Transaction rows

Bottom sheets

Modals

Tabs

Chips

Badges

Alerts

Toast messages

Navigation

Month selectors

Currency inputs

Date selectors

Empty states

Skeleton loaders

All components must share the same design language.

==================================================

DESIGN QUALITY BAR

==================================================

The UI should look like a polished consumer fintech product, not an AI-generated template.

Avoid:

generic gradients

generic dashboard cards

excessive shadows

random rounded corners

inconsistent spacing

random icon styles

overloaded charts

too many colors

too much text

Prioritize:

hierarchy

spacing

typography

whitespace

consistency

speed

clarity

==================================================

DASHBOARD PRIORITY ORDER

==================================================

The visual hierarchy MUST prioritize:

1. Safe to Spend

2. Overall monthly financial status

3. Budget health

4. Savings

5. Goals

6. Recent transactions

Do not make charts more important than actual financial decisions.

==================================================

PRODUCT LANGUAGE

==================================================

Use friendly, human language.

GOOD:

"You're on track."

"You have Rs. 18,400 safe to spend."

"Nice work. Your savings target is complete."

"You are 64% closer to your goal."

AVOID:

"Budget violation."

"Financial failure."

"Insufficient performance."

"Warning: poor financial behavior."

Never shame users.

==================================================

V1 BOUNDARY

==================================================

MUST BUILD:

Splash

Terms / Privacy Agreement

Authentication

OTP

PIN setup

User onboarding

Job Holder profile

Income

Fixed expenses

Variable expenses

Savings

Emergency Fund

Goals

Milestones

Budget generation

Dashboard

Safe to Spend

Budget

Weekly spending

Transactions

Add Expense

Add Income

Monthly Review

Month history

Profile

Settings

Security

Light mode

Dark mode

Responsive web design

Loading states

Empty states

Error states

Success states

Dashboard first-use guide

DO NOT BUILD:

Bank account linking

Real money transfers

Payment processing

Wallet

Debit cards

Bill payment

Crypto

Investment portfolio

Credit score

Complex accounting

AI chatbot

Social network

Advanced business accounting

==================================================

V2 ARCHITECTURE READINESS

==================================================

Keep architecture extensible for:

AI financial insights

Recurring transactions

Multiple income sources

Variable income

Advanced reports

Business Mode

Family/shared budgets

PDF/CSV exports

Smart notifications

Advanced goal intelligence

Personalized financial recommendations

Do NOT clutter V1 with these.

==================================================

IMPORTANT IMPLEMENTATION RULE

==================================================

Do not create a collection of disconnected mockup screens.

All screens must belong to one coherent navigation system.

Buttons must lead to logically correct destinations.

Forms must preserve state.

The same budget data must update across:

Dashboard

Budget

Transactions

Savings

Goals

Monthly Review

Use shared components and shared data models.

Do not duplicate business logic across screens.

==================================================

FINAL EXPERIENCE

==================================================

The finished product should make a user feel:

"I know where my money is going."

"I know what I can safely spend."

"I know how much I have saved."

"I know what I am saving for."

"I know how long it will take."

"I am in control."

The product should transform monthly money management from a stressful accounting task into a simple, visual, motivating daily habit.

FINAL RULE:

BUILD A BEAUTIFUL PERSONAL MONEY CONTROL SYSTEM.

DO NOT BUILD A BANK.

DO NOT BUILD A WALLET.

DO NOT BUILD A PAYMENT APP.

BUILD THE PRODUCT A SALARIED PERSON WOULD WANT TO OPEN EVERY DAY TO UNDERSTAND AND CONTROL THEIR MONEY.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://safe-spend-plan.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8f7eb744-0d99-4c48-9739-d120d540d3a0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
