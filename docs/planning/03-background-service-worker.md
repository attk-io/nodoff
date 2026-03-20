# Phase 3: Background Service Worker

**Status: Complete**

**Goal:** Fully functional timer management with alarm-based scheduling.

## File: `entrypoints/background.ts`

## Key Decisions

- **Storage**: Use WXT's `storage.defineItem()` API (auto-imported, typed, session-scoped) instead of raw `chrome.storage.session`
- **`lastTimerTabId`**: Cleared on cancel and tab close (not just on cancel)
- **Recovery**: Attempt `FADE_OUT` on past-due timers during service worker restart
- **Badge**: Colored dot indicator (●) for active timer on current tab — no time remaining text, no animation, no recurring alarm

## Steps

1. **Storage items** — Define typed WXT storage items using `storage.defineItem()` for `timers` and `lastTimerTabId` (session-scoped)

2. **`startTimer(tabId, url, durationMs)`**:
   - Create `TimerState` with `status: "active"`, `expiresAt: Date.now() + durationMs`
   - Save to `timersStorage` (read current, add entry keyed by `String(tabId)`, write back)
   - Create alarm: `chrome.alarms.create(`timer-${tabId}`, { when: expiresAt })`
   - Update `lastTimerTabIdStorage` to `tabId`
   - Update badge for the tab

3. **`cancelTimer(tabId)`**:
   - Remove timer from storage, clear alarm
   - If `lastTimerTabIdStorage` equals `tabId`, clear to `null`
   - Update badge for the tab

4. **Alarm listener** (`chrome.alarms.onAlarm`):
   - Extract tabId from alarm name
   - Update timer status to `"expired"`
   - Send `FADE_OUT` message to content script via `chrome.tabs.sendMessage()` (try/catch)

5. **Message listener** (`chrome.runtime.onMessage`):
   - Handle `START_TIMER`, `CANCEL_TIMER`, `GET_TIMER_STATE`
   - Return `true` for async response via `sendResponse`

6. **Tab cleanup** (`chrome.tabs.onRemoved`):
   - Remove timer entry and clear alarm when tab closes
   - If `lastTimerTabIdStorage` equals removed tabId, clear to `null`

7. **Service worker recovery** (on startup):
   - Read all timers from storage
   - Past-due active timers: mark as `"expired"`, attempt `FADE_OUT` (try/catch)
   - Still-active timers: re-register alarms
   - Write updated timers back to storage

8. **Badge management**:
   - `updateBadge(tabId)`: green dot (●) if tab has active timer, clear otherwise
   - `chrome.tabs.onActivated`: call `updateBadge` when user switches tabs
   - No recurring alarm needed — badge only reflects active/not-active state

## Verification

- Each step: `bun run type-check` passes
- Final: `bun run build` succeeds
- Manual: Load extension, use service worker devtools console to send `START_TIMER` messages. Terminate and restart the service worker — confirm timer still fires. Close a tab — confirm its timer is cleaned up from storage.
