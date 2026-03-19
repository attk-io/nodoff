# Phase 3: Background Service Worker

**Goal:** Fully functional timer management with alarm-based scheduling.

## File: `entrypoints/background.ts`

## Steps

1. **Storage helpers** — `saveTimers()` / `loadTimers()` wrapping `chrome.storage.session`

2. **`startTimer(tabId, url, durationMs)`**:
   - Create `TimerState` with `expiresAt: Date.now() + durationMs`
   - Save to storage keyed by tabId
   - Create alarm: `chrome.alarms.create(`timer-${tabId}`, { when: expiresAt })`
   - Update `lastTimerTabId`

3. **`cancelTimer(tabId)`**:
   - Remove timer from storage, clear alarm

4. **Alarm listener** (`chrome.alarms.onAlarm`):
   - Extract tabId from alarm name
   - Update timer status to `"expired"`
   - Send `FADE_OUT` message to content script via `chrome.tabs.sendMessage()`

5. **Message listener** (`chrome.runtime.onMessage`):
   - Handle `START_TIMER`, `CANCEL_TIMER`, `GET_TIMER_STATE`

6. **Tab cleanup** (`chrome.tabs.onRemoved`):
   - Remove timer entry and clear alarm when tab closes

7. **Service worker recovery** (on startup):
   - Reload timers from storage
   - Fire any past-due timers immediately
   - Re-register alarms for still-active timers

8. **Badge management**:
   - On `chrome.tabs.onActivated`: check if active tab has a timer -> show its remaining time; if not -> show `lastTimerTabId`'s remaining time; if neither -> clear badge
   - Update badge text every 60 seconds via a recurring alarm

## Verification

Load extension, use service worker devtools console to send `START_TIMER` messages manually. Terminate and restart the service worker — confirm timer still fires. Close a tab — confirm its timer is cleaned up from storage.
