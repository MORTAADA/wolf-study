# White Wolf Scholar V65.32 — Legacy API Retirement

## Goal
Retire the obsolete V65.26 Domain/Repository/Application/Architecture-v2 bridge while preserving runtime/UI compatibility.

## Canonical path
UI → Runtime/UI Projection → Academic Services → Academic Repositories → Core Persistence

## Retired
- WWDomain / domain-model.js
- WWRepositories / repository.js
- legacy application-services.js
- architecture-v2.js
- architecture-integration.js

## Compatibility
`legacy-api-retirement-v65.32.js` exposes a minimal deprecated `WWApplication` facade because architecture health checks still require the application contract. It does not own academic persistence.

## QA gates
Static syntax, HTML local references, service-worker shell, retired-reference scan, ZIP integrity.
