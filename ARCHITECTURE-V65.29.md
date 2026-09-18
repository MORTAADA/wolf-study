# White Wolf Scholar V65.29 — Full Cross-Feature Wiring

## Contract flow
Planning → Daily Mission context → execution events → Sessions/Tasks/Resources → Mastery → Analytics/Adaptive Revision.
Exams publish context changes into Exam Intelligence and Adaptive Revision.
Errors and Flashcard reviews update Mastery context and revision/analytics context.

## Source of truth
Planning remains the planning source of truth. V65.29 does not replace the legacy UI state in one risky cutover; the Academic repositories are the shared persistence/contract layer and the event bus is the cross-feature coordination layer.

## Main modules
- academic-os-integration.js: legacy state ↔ unified repositories + event persistence.
- academic-os-cross-feature.js: event-driven coordination between academic contracts and existing intelligence engines.
- academic-services.js: explicit save/complete APIs.
- academic-entities.js: normalized academic entities.
- academic-repositories.js: repository contracts.
- academic-migrations.js: schema versioning.

## Events
PLANNING_UPDATED, SESSION_COMPLETED, TASK_COMPLETED, RESOURCE_STUDIED, EXAM_UPDATED, ERROR_CREATED, ERROR_REVIEWED, MASTERY_CHANGED, FLASHCARD_REVIEWED.
Derived context events: DAILY_MISSION_CONTEXT_CHANGED, ANALYTICS_CONTEXT_CHANGED, MASTERY_CONTEXT_REFRESHED, REVISION_CONTEXT_CHANGED, RESOURCE_INTELLIGENCE_CONTEXT_CHANGED, EXAM_INTELLIGENCE_CONTEXT_CHANGED.

## Safety
No automatic planning mutation is introduced. Event handlers are guarded against re-entry and errors are isolated with warnings so a failed intelligence refresh does not break the UI.
