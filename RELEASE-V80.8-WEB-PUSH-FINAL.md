# White Wolf Scholar V80.8 — Final Web Push Integration

- Frontend automatically targets the deployed Cloudflare Push Gateway.
- Public VAPID key is fetched from `/config`; no private key or ADMIN_TOKEN is stored in the PWA.
- Settings include one-click Web Push activation.
- Existing service worker receives push events while the app is closed.
- Planning remains the source of truth.
- Backend update V80.8 adds the public `/config` route.
