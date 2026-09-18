# White Wolf Scholar V65.27 — Cross-Feature Academic Architecture

V65.27 completes the integration step after the V65.26 layer split.

## Contracts
- PLANNING_UPDATED
- SESSION_COMPLETED
- ERROR_CREATED / ERROR_REVIEWED
- FLASHCARD_REVIEWED
- RESOURCE_STUDIED
- TASK_COMPLETED
- EXAM_UPDATED
- MASTERY_CHANGED
- QUIZ_COMPLETED

## Rule
The legacy application state remains the source of truth. Cross-feature communication uses explicit events rather than direct feature-to-feature calls. Study Performance consumes completed-session events; Mastery, Analytics, Planning, Resources and Review remain independently replaceable services.

## Target layers
Core → Persistence → Domain → Events → Services → Features → UI

## QA
Static syntax/reference/service-worker checks must pass before release. Android install/offline/reopen still requires a real-device QA gate.
