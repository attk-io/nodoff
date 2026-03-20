# Phase 4: Content Script

**Status: Complete**

**Goal:** Smooth 10-second volume fade-out and media pause.

## Context

The content script (`entrypoints/content.ts`) is currently a placeholder. The background service worker (phase 3) already sends a `FADE_OUT` message to the content script when a timer expires. We need the content script to handle that message by smoothly fading out all media volume over 10 seconds, then pausing.

**Scope decisions:**

- Top-level document only — no iframe traversal
- Fire-and-forget — no completion message back to background

## Files to modify

- `entrypoints/content.ts` — the only file that needs changes

## Existing code to reuse

- `FadeOutMessage` type from `types/messages.ts:25-27`
- Background already sends `{ type: "FADE_OUT" }` via `browser.tabs.sendMessage` (background.ts:97, 130)
- WXT's `defineContentScript` is already in use

## Steps

### Step 0: Update planning doc

Update `docs/planning/04-content-script.md` with this finalized plan.

**Verify:** Diff the file to confirm it reflects the plan below.

### Step 1: Add message listener

Inside the `main()` function of `defineContentScript`, register a `browser.runtime.onMessage` listener that handles messages with `type: "FADE_OUT"`.

**Verify:** Load the extension in Chrome, open devtools on a page, and confirm the content script loads without errors.

### Step 2: Implement `fadeOutAndPause()`

Write the fade-out function:

1. Query all `document.querySelectorAll("audio, video")` elements
2. Filter to elements that are not paused (only fade active media)
3. Store each element's current volume
4. Use `setInterval` at 100ms intervals for 100 steps (10 seconds total)
5. Each step: linearly interpolate volume from stored value → 0
6. On completion (step 100): call `.pause()` on each element, `clearInterval`

Edge cases:

- If no media elements found, do nothing (no error)
- If an element is already at volume 0, still pause it
- Guard against elements being removed from DOM mid-fade (wrap volume set in try/catch)

**Verify:** Open a YouTube video, trigger `FADE_OUT` from devtools console:

```js
chrome.runtime.sendMessage({ type: "FADE_OUT" });
```

Confirm volume decreases smoothly over ~10 seconds, then video pauses.

### Step 3: Mark planning doc complete

**Verify:** `docs/planning/04-content-script.md` is marked as complete.

## Verification (end-to-end)

1. Load extension in Chrome (`bun run dev`)
2. Open a YouTube video and let it play
3. From the background service worker console, send:
   ```js
   chrome.tabs.sendMessage(TAB_ID, { type: "FADE_OUT" });
   ```
4. Confirm: volume fades smoothly over ~10 seconds, then video pauses
5. Repeat with a page that has no media — confirm no errors in console
