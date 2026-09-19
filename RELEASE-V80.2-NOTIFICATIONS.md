# White Wolf Scholar V80.2 — Notification System

## Included
- Notification catalog: Planning, Tasks/Deadlines, Exams, Smart Review/Mastery, Resources, White Wolf Intelligence, Progress/Streak, Weekly Report.
- Foreground scheduling every minute.
- Notification Center remains local and readable inside the app.
- Per-category switches.
- Quiet hours.
- Deadline reminders: 24h / 6h / 1h / 15min + overdue.
- Exam reminders: 7d / 3d / 1d / today.
- Session reminder: 15 minutes before a scheduled course/session.
- Service Worker `push` receiver and `notificationclick` handler for closed-app Web Push delivery.
- Generic Push Gateway configuration API (`WWNotifications.configurePush`) and subscription API (`subscribePush`).

## Important architecture constraint
A PWA can display a Web Push notification while the app UI is closed only when a push service/backend sends the message to the browser subscription. V80.2 therefore includes the browser/service-worker infrastructure but does not pretend that a GitHub Pages static site can itself send arbitrary future push messages.

Planning remains the source of truth. Notifications observe planning/tasks/exams/review signals and never silently rewrite planning.
