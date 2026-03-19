# Phase 2: Type Definitions

**Goal:** Define all shared types before implementation (type-first approach).

## Files

### `types/timer.ts` — Core types

- `TimerStatus` — `"idle" | "active" | "expired"`
- `TimerState` — `{ tabId: number; url: string; status: TimerStatus; durationMs: number; expiresAt: number; createdAt: number }`
- `TimerPreset` — `{ label: string; durationMs: number }`

### `types/messages.ts` — Message passing (discriminated union)

- `StartTimerMessage` — `{ type: "START_TIMER"; durationMs: number; tabId: number; url: string }`
- `CancelTimerMessage` — `{ type: "CANCEL_TIMER"; tabId: number }`
- `GetTimerStateMessage` — `{ type: "GET_TIMER_STATE"; tabId: number }`
- `TimerStateResponse` — `{ type: "TIMER_STATE"; state: TimerState | null }`
- `FadeOutMessage` — `{ type: "FADE_OUT" }` (background -> content script)
- `Message` — discriminated union of all message types

### `types/storage.ts` — Storage schema

- `SessionStorageSchema` — `{ timers: Record<string, TimerState>; lastTimerTabId: number | null }`

## Verification

`bun run build` succeeds with no type errors.
