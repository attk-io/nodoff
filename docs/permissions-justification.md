# Nodoff — Permissions Justification

This document provides justification for each permission declared in the Nodoff extension manifest, as required for Chrome Web Store review.

## `storage`

**Purpose:** Session-scoped timer state persistence.

Nodoff uses `chrome.storage.session` to store active timer state (duration, expiration timestamp, tab ID). This allows timers to survive page refreshes within the same session. Session storage is ephemeral and clears when the browser closes.

**Used in:** `entrypoints/background.ts` — `storage.defineItem("session:timers")`, `storage.defineItem("session:lastTimerTabId")`

## `alarms`

**Purpose:** Background timer scheduling.

Nodoff uses `chrome.alarms` to schedule timer expiration events. When a user sets a sleep timer, an alarm is created with the target expiration time. When the alarm fires, the background service worker triggers the fade-out sequence.

**Used in:** `entrypoints/background.ts` — `browser.alarms.create()`, `browser.alarms.clear()`, `browser.alarms.onAlarm.addListener()`

## `activeTab`

**Purpose:** Current tab access for media control.

Nodoff needs to identify the active tab when the user sets a timer from the popup. The tab ID is used to associate timers with specific tabs and to send messages to the correct content script.

**Used in:** `entrypoints/popup/composables/useTimer.ts` — `browser.tabs.query({ active: true, currentWindow: true })`

## `scripting`

**Purpose:** Content script injection for volume fade-out.

Nodoff injects a content script that listens for fade-out commands from the background service worker. When a timer expires, the content script gradually reduces the volume of all audio and video elements over 10 seconds, then pauses them.

**Used in:** `entrypoints/content.ts` — `defineContentScript()` with `matches: ["<all_urls>"]`
