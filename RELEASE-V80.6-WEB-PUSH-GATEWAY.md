# White Wolf Scholar V80.6 — Real Web Push Gateway Integration

V80.6 adds the server-side component required for real Web Push while the PWA is closed.

## Frontend
- Notification Core version 80.6.
- Push endpoint + VAPID public-key fields in notification settings.
- Private VAPID credentials never belong in the frontend.
- Service Worker cache/version updated to 80.6.
- Removed stale Service Worker shell reference to `release-hardening-v80.js`, which was absent from the package.

## Backend
`push-gateway/` is a deployable Node.js service using `web-push`.
- `/subscribe` stores browser subscriptions.
- `/send` sends immediately (admin token required).
- `/schedule` stores a future notification.
- `/cron` sends due jobs and removes expired subscriptions.
- `/health` provides a health check.

## Production
The gateway must be deployed on an HTTPS host. GitHub Pages remains the frontend/PWA. A scheduler must call `/cron` regularly for future scheduled notifications.
