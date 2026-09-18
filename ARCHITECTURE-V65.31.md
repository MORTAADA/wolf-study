# White Wolf Scholar — V65.31
## Full Feature Migration

- Academic OS repositories are the persistence contract for academic entities.
- Legacy `state` is retained as a runtime/UI projection for compatibility.
- Academic entities normalize common legacy snake_case identifiers.
- Feature migration bridge exposes explicit Academic Services write entry points.
- Event persistence keeps sessions/tasks/resources/exams/errors/mastery/flashcards/planning synchronized.
- Planning remains authoritative; no automatic plan mutation is introduced.
- Service worker cache bumped to v65.31.

### Target flow
UI Feature → Feature Controller / Academic Service → Repository → Core Persistence → Event Bus → Intelligence/Analytics projections.
