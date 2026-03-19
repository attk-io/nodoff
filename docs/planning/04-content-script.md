# Phase 4: Content Script

**Goal:** Smooth 10-second volume fade-out and media pause.

## File: `entrypoints/content.ts`

## Steps

1. WXT content script config: `matches: ["<all_urls>"]`, `runAt: "document_idle"`

2. **`fadeOutAndPause()`**:
   - Query all `audio` and `video` elements
   - Store each element's current volume
   - 100 steps over 10 seconds (100ms interval): linearly reduce volume to 0
   - On completion: `.pause()` each element, clear interval

3. **Message listener**: handle `FADE_OUT` -> call `fadeOutAndPause()`

## Verification

Open a YouTube video, trigger `FADE_OUT` message from devtools. Confirm volume smoothly decreases over ~10 seconds, then video pauses.
