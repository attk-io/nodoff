# Phase 5: Popup Vue Application

**Status:** Complete

**Goal:** Complete popup UI with Idle, Active, and Expired states.

## Files

```
entrypoints/popup/
  index.html
  main.ts
  App.vue
  components/
    IdleView.vue
    ActiveView.vue
    ExpiredView.vue
  composables/
    useTimer.ts
```

## Steps

1. **`useTimer()` composable**:
   - On mount: get current tab via `chrome.tabs.query({ active: true, currentWindow: true })`
   - Send `GET_TIMER_STATE` to background, populate reactive `timerState`
   - Derive `status` computed: returns `timerState.value?.status ?? "idle"`
   - Expose `startTimer(durationMs)` — sends `START_TIMER` with tabId/url/durationMs
   - Expose `cancelTimer()` — sends `CANCEL_TIMER` with tabId
   - Expose `resetTimer()` — sends `CANCEL_TIMER` then sets local state to null (returns to idle)
   - 1-second `setInterval` to update `remainingMs` computed from `expiresAt - Date.now()`
   - Listen to `chrome.storage.onChanged` for real-time state updates
   - Clean up interval and listener on unmount

2. **`IdleView.vue`**:
   - Preset buttons: 1m, 15m, 30m, 45m, 1h
   - Custom duration input (minutes), min 1 / max 480
   - "Start" button for custom duration
   - Preset buttons call `startTimer` directly

3. **`ActiveView.vue`**:
   - Countdown display (`MM:SS` for < 1 hour, `HH:MM:SS` for >= 1 hour)
   - Derives display from `remainingMs` provided by `useTimer`
   - Cancel button calls `cancelTimer()`

4. **`ExpiredView.vue`**:
   - "Timer expired" message
   - "Set New Timer" button calls `resetTimer()` to return to idle

5. **`App.vue`**: Route to correct view based on `status` computed. Width updated to `w-80` (320px).

6. **Styling**: Tailwind, w-80 popup width (320px), clean/minimal design

## Verification

- Build with `npx wxt build`, confirm TypeScript compiles
- Playwright screenshots of popup HTML to verify UI rendering
- Full flow test: set a 1-minute timer, watch countdown, confirm expiry UI
- Cancel mid-countdown, custom duration, "Set New Timer" reset
- Different tabs show independent states
