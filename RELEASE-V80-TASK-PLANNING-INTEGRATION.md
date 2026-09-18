# White Wolf Scholar V80.0 — Task ↔ Planning Integration

## Goal
Tasks are now first-class inputs to Planning Intelligence without modifying the Weekly Planning source of truth.

## Task model
- `date`: task day
- `time`: optional start time (backward compatible)
- `deadlineTime`: optional completion deadline
- `estimatedMinutes`: expected effort; defaults to 30 when unspecified
- `priority`: existing priority
- `isDone`: existing completion state

If both start and deadline are provided and duration is omitted/zero, duration is derived from the interval.

## Intelligence behavior
- Weekly Planning remains authoritative and is never silently rewritten.
- Daily Mission continues to represent explicit Weekly Planning items.
- Planning Intelligence additionally displays open tasks for today.
- Task load is compared with indicative free windows.
- A task with a deadline can be flagged when the available time before its deadline is insufficient.
- No automatic rescheduling is performed.

## Compatibility
Existing tasks without `deadlineTime` or `estimatedMinutes` are normalized on load.

## QA
- JavaScript syntax: PASS
- HTML script references: 51/51 PASS
- Task deadline/duration logic: PASS
- Planning Intelligence task integration: PASS
- Previous resource crash pattern absent: PASS
- ZIP integrity: PASS
