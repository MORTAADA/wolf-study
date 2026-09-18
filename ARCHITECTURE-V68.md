# White Wolf Scholar V68 — Full Legacy Persistence Cutover

## Architecture rule
`state` is a volatile UI projection. Academic entities are persisted only through repositories.

## Write path
UI mutation → `saveState()` → `WWAcademicProjectionV68.reconcile()` → Repository → IndexedDB.

The persistence layer stores non-academic UI preferences in `appState`; academic entities are not written back into `appState`.

## Reconciliation
The projection layer computes entity-level deltas for:
subjects, topics, sessions, tasks, resources, exams, errors, flashcards, mastery, planning.

Only added/changed entities are upserted and removed entities are deleted through repository contracts.

## Guarantees
- Repository data is the academic source of truth.
- Multi-feature code can keep using the UI projection during migration.
- No full `state` snapshot is used to persist academic entities.
- Repository writes are serialized per entity collection.
- Architecture remains local-first/offline-first.

## Remaining compatibility
Some feature handlers still mutate the UI projection directly. This is intentionally supported by reconciliation so the migration can proceed incrementally without breaking UX. Future versions can replace those handlers with Commands one feature at a time.
