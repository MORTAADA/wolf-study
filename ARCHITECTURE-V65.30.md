# White Wolf Scholar V65.30 — Legacy State Cutover & Single Source of Truth

## Objective
The Academic OS repositories are now the canonical persistence layer for academic entities. The legacy `state` object remains a runtime/UI projection for compatibility with the existing interface.

## Canonical entities
Subject, Topic, Session, Task, Resource, Exam, Error, Flashcard, Mastery, Planning.

## Runtime model
UI/features -> runtime `state` projection -> Academic OS Cutover -> unified repositories -> Core Persistence.

`appState` remains for non-academic UI/application settings and backward compatibility. Academic entities are persisted through the unified repositories.

## Safety
- First boot migrates the existing legacy state into the unified repositories.
- Subsequent loads hydrate academic entities from repositories.
- Legacy UI code is not force-deleted, avoiding a destructive rewrite.
- Saves write academic entities to the canonical repository layer.
