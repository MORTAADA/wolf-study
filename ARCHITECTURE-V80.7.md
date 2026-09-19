# White Wolf Scholar V80.7 — Cloudflare Push Gateway

## Source of truth
Planning remains the source of truth. Notifications consume planning/tasks/exams/review signals and never rewrite planning.

## Deployment topology
- GitHub Pages: static PWA + Service Worker.
- Cloudflare Worker: Web Push gateway/API + 1-minute Cron trigger.
- Cloudflare D1: subscriptions + scheduled notification jobs.
- VAPID private key and admin token: Cloudflare secrets only.

## Runtime flow
PWA -> POST /subscribe -> Worker -> D1
Admin/scheduler -> /schedule -> D1
Cron -> due jobs -> Web Push -> browser Service Worker -> OS notification

## Free-tier target
The design targets personal/small-scale use within Cloudflare Workers Free and D1 Free limits. It does not claim unlimited free usage.
