# Nodoff

A Chrome extension sleep timer that automatically pauses audio or video after a configurable timeout.

## Core Features

- **Sleep Timer** — Pauses any audio or video on a page after a user-configured timeout
- **Smooth Volume Fade-Out** — Volume scales down to 0 over a 10-second period before pausing media
- **Preset & Custom Timers** — Quick-select presets (15m, 30m, 45m, 1h) plus a custom duration input
- **Per-Tab Timer Management** — Each tab can have its own independent timer, tracked by tab ID
- **Session Persistence** — Timer state survives page refresh but clears when the tab or browser closes
- **Expired State** — Popup displays a message when the sleep timer has fired

## Tech Stack

- **Build Tool**: Bun
- **Language**: TypeScript
- **UI Framework**: Vue
- **Styling**: Tailwind CSS
- **Extension APIs**: Chrome Extension Manifest V3

## Architecture

### Background Service Worker

Manages all active timers. Runs continuously regardless of whether the popup is open. Responsible for:

- Tracking countdown state per tab (keyed by tab ID)
- Persisting timer state to `chrome.storage.session`
- Signaling the content script when a timer expires

### Popup (Vue)

The extension popup is a Vue application styled with Tailwind CSS. It communicates with the background service worker to start, cancel, and display timers. Displays:

- Preset duration buttons (15m, 30m, 45m, 1h)
- Custom duration input
- Active countdown for the current tab
- Expired-state message when the timer has fired

### Content Script

Injected into pages to interact with media elements. Responsible for:

- Executing the volume fade-out across all `<audio>` and `<video>` elements
- Pausing media after the fade-out completes

## Timer Behavior & Fade-Out Logic

1. User sets a timer duration via the popup (preset or custom)
2. Background service worker starts a countdown for the active tab, keyed by its tab ID
3. When the countdown reaches zero, the background worker signals the content script
4. Content script performs a **10-second linear volume fade-out** on all audio/video elements
5. Once volume reaches 0, content script **pauses** all media elements
6. Popup transitions to the expired state

## Scope Rules

- **Per-tab**: Each tab operates independently; setting a timer on one tab does not affect others
- **Tracked by tab ID**: Timers are associated with the tab's ID, enabling simpler cleanup via `tabs.onRemoved` and independent timers for tabs on the same URL
- **Session-scoped**: State is stored in `chrome.storage.session` — survives page refresh within the same session, but clears when the tab or browser is closed

## UI States

| State       | Popup Display                                |
| ----------- | -------------------------------------------- |
| **Idle**    | Preset buttons + custom input                |
| **Active**  | Countdown timer with cancel option           |
| **Expired** | "Timer expired" message with option to reset |
