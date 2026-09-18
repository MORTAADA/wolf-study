# White Wolf Scholar V65.35 — Architecture Dependency Audit + Session Data Integrity

## Scope
- Fix legacy session normalization: `duration` now maps to `actualMinutes` when `actualMinutes` is absent.
- Runtime projection now mirrors repository arrays even when empty, preventing stale UI data.
- Add runtime architecture/dependency/data-integrity gate.
- Keep Academic OS repositories as persistence source of truth.

## Gates
1. Runtime layer availability.
2. Legacy architecture reference audit.
3. Academic entity validation across repositories.
4. PWA Service Worker version/cache integration.
