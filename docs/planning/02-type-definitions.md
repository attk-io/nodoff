# Phase 2: Type Definitions

**Status: Complete**

**Goal:** Define all shared types before implementation (type-first approach).

## Decisions

- **TimerPreset** — moved out of `types/`; it's a UI concern and will be defined as a const array in the popup code (Phase 5)
- **Message union** — flat discriminated union; no split by direction
- **Responses** — `TimerStateResponse` included alongside request types in the union
- **Storage key convention** — `Record<string, TimerState>` with tabId coerced to string (standard JSON key behavior, no branded type needed)

## Files

### `types/timer.ts` — Core types

- `TimerStatus` — `"idle" | "active" | "expired"`
- `TimerState` — `{ tabId: number; url: string; status: TimerStatus; durationMs: number; expiresAt: number; createdAt: number }`

### `types/messages.ts` — Message passing (discriminated union)

- `StartTimerMessage` — `{ type: "START_TIMER"; durationMs: number; tabId: number; url: string }`
- `CancelTimerMessage` — `{ type: "CANCEL_TIMER"; tabId: number }`
- `GetTimerStateMessage` — `{ type: "GET_TIMER_STATE"; tabId: number }`
- `TimerStateResponse` — `{ type: "TIMER_STATE"; state: TimerState | null }`
- `FadeOutMessage` — `{ type: "FADE_OUT" }` (background -> content script)
- `Message` — discriminated union of all message types

### `types/storage.ts` — Storage schema

- `SessionStorageSchema` — `{ timers: Record<string, TimerState>; lastTimerTabId: number | null }`

### `types/index.ts` — Barrel export

Re-exports all types from a single entry point.

## Verification

`bun run build` and `bun run type-check` succeed with no type errors.
