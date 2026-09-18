# White Wolf Scholar — V65.34 Architecture Hardening & Final Gate

## Target
Core → Persistence → Domain → Events → Services → Features → UI.

## Guardrails
- Unified Academic Entity Model.
- Unified repositories for academic entities.
- Explicit event contracts.
- Academic Runtime is a UI projection, not academic persistence authority.
- Legacy architecture globals are not part of the required contract.
- Architecture gate validates required layers, repositories and event contracts.

## QA Gate
Static checks must cover JS syntax, HTML local references, Service Worker shell references, legacy architecture references, and ZIP integrity.

## Scope
This release hardens architecture and diagnostics. It does not claim Android runtime validation.
