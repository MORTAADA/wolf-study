# White Wolf Scholar — V68.0 Academic OS Architecture

## Goal
Establish a real application boundary around the Academic OS while preserving the existing UI projection for compatibility.

## Runtime flow
UI → Commands/Queries → Domain Entities → Repositories → IndexedDB/Persistence

Domain events flow through the Event Bus to cross-feature services such as Mastery, Study Performance and Analytics.

## Source of truth
Academic repositories are authoritative for academic entities. The legacy `state` object is a volatile rendering projection and compatibility adapter.

## V67 changes
- Explicit Commands/Queries boundary (`academic-os-v4.js` + `academic-os-v5.js`).
- Explicit entity-kind mapping; no plural-string inference.
- Command serialization per repository/entity kind.
- Event envelopes with id/version/timestamp/source/payload metadata.
- Diagnostic records for command/query/transaction failures.
- Compatibility write bridge for legacy UI paths (`academic-write-bridge.js`).
- Focus sessions, errors and resources now issue repository Commands directly.
- PWA shell includes V67 modules.

## Remaining migration strategy
Legacy UI mutations that still update the volatile projection are treated as compatibility paths. They are progressively migrated to Commands rather than allowing UI code to access persistence directly.

## Architectural invariant
No UI feature should call IndexedDB/localStorage directly for Academic entities. Persistence is reached through repositories/services.
