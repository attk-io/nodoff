# Phase 5: Popup Vue Application

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
   - Expose `startTimer(durationMs)` and `cancelTimer()`
   - 1-second interval to update countdown display (compute from `expiresAt - Date.now()`)
   - Listen to `chrome.storage.onChanged` for state updates

2. **`IdleView.vue`**:
   - Preset buttons: 15m, 30m, 45m, 1h
   - Custom duration input (minutes), min 1 / max 480
   - "Start" button

3. **`ActiveView.vue`**:
   - Countdown display (`MM:SS` or `HH:MM:SS`)
   - Cancel button

4. **`ExpiredView.vue`**:
   - "Timer expired" message
   - "Set New Timer" button -> resets to idle

5. **`App.vue`**: Route to correct view based on `timerState.status`

6. **Styling**: Tailwind, 320px popup width, clean/minimal design

## Verification

Full flow test — set a 1-minute timer, watch countdown, confirm expiry UI. Cancel mid-countdown. Custom duration. Different tabs show independent states.
