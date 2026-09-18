# White Wolf Scholar V79 — Production Release

V79 is the product-hardening release after the V78 architecture freeze.

## Included
- Production cache/version alignment to V79.
- Runtime diagnostics (`WWReleaseV79`) with persistence, PWA, storage and event-journal health.
- Safe `/` keyboard shortcut to global search when focus is not inside a form control.
- Backup/Restore upgraded to accept current V79 backups.
- Backup now captures core IndexedDB academic records and the V77 event journal/outbox when available.
- Existing local-first/offline architecture preserved.
- Planning remains the source of truth; no automatic planning mutation introduced.
- Tutor/Chatbot system is not reintroduced.

## Architecture status
V78 remains frozen. V79 changes are operational/product hardening only; they do not reopen the academic architecture.
