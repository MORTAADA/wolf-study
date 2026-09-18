# White Wolf Scholar — V77/V78 Final Architecture

## V77 — Immutable Academic Event Journal
- Event Journal stores historical academic facts append-only.
- Outbox stores delivery state separately from history.
- Each journal record has eventId, monotonic sequence, occurredAt, type, version, source, aggregate metadata and payload.
- Duplicate eventIds are ignored.
- Journal supports deterministic replay by sequence range.
- Local-first persistence uses the existing CorePersistence contract.

## V78 — Architecture Final Gate
- Adds a read-only architecture audit and an explicit freeze marker.
- Does not silently reorganize Planning.
- Does not reintroduce Tutor/Chatbot.
- Academic repositories remain the persistence layer; state remains a UI projection.
- Event history is separated from operational outbox state.

## Frozen flow
UI / Features → state projection → V68 reconciliation → Academic Repositories
Domain events → Event Bus → Immutable Event Journal → Outbox

V78 is the architecture freeze. Future work should be feature/UX/performance/stability work, not another architecture-numbering cycle.
