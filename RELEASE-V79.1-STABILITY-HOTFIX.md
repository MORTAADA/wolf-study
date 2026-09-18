# White Wolf Scholar V79.1 — Stability Hotfix

## Incident fixed
The production build could crash in the Resources feature with:

`(folders[fn] || []).forEach is not a function`

This happens when local data contains an older/mixed resource schema where a subject is an array, or a folder contains a single resource object instead of an array.

## Fixes
- Added a resource-schema guard and automatic in-memory normalization.
- Supports legacy subject-level resource arrays.
- Supports legacy direct resource objects.
- Converts malformed folder values into safe arrays.
- Applied the guard to resource listing, opening, favorites, studied state, study-time logging and deletion.
- Normalizes resource data immediately after loading persisted state.
- Added the V79 release-hardening module to the actual HTML script graph.
- Fixed the Cross-Feature module loading order by making it deferred.
- Aligned application script cache query versions to V79.1.
- Aligned the Service Worker cache name to V79.1.

## Verification
- JavaScript syntax: 0 errors across all project JS files.
- HTML script references: 51 / 51 resolved.
- Resource malformed-schema regression test: PASS.
- Resource extraction after normalization: 3 / 3 records recovered in the regression fixture.
- ZIP integrity: PASS.

## Scope
No academic architecture redesign was introduced. Planning remains the source of truth. Tutor/Chatbot was not reintroduced.
