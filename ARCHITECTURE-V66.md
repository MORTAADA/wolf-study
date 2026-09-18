# White Wolf Scholar — V66 Academic OS Architecture

## Objective
V66 turns the existing Academic OS layers into a stricter application boundary while preserving the current UI and PWA behavior.

## Architecture
UI → Commands / Queries → Domain Entities → Repositories → Persistence

Cross-feature communication uses explicit domain events. Intelligence and Analytics consume events/context rather than owning persistence.

## V66 guarantees
- Academic repositories remain the single persistence source of truth.
- Runtime `state` is a UI projection/compatibility surface, not the academic persistence authority.
- Commands serialize writes per entity collection.
- Queries provide a read boundary.
- Academic events carry eventId, version, timestamp, source and payload metadata.
- Repository reads use an in-memory cache and writes are serialized.
- Multi-repository cutover uses a single IndexedDB read/write transaction through `batchSet` when available.
- Architecture diagnostics record command/query failures without breaking the UI.
- Schema version remains explicit and compatible with the existing migration layer.
- Existing features/routes are preserved; this release is architecture-first.

## Core APIs
`WWAcademicOSV4.commands` — write use cases.
`WWAcademicOSV4.queries` — read use cases.
`WWAcademicOSV4.publish()` — event publication boundary.
`WWAcademicOSV4.diagnostics()` — bounded runtime diagnostics.
`WWAcademicRepositories.batchReplace()` — atomic multi-collection persistence boundary.
`WWCorePersistence.batchSet()` — one IndexedDB transaction for multiple keys.

## Remaining migration rule
Non-academic state such as UI preferences, programming progress, Quran data and notification UI state remains in the existing app-state document. Academic entities are persisted through the Academic repositories. This avoids a destructive rewrite of unrelated features while maintaining one academic source of truth.
