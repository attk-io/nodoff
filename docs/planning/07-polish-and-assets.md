# Phase 7: Polish & Store Assets

**Status:** Complete

**Goal:** Production-ready extension with branding, store assets, and documentation for Chrome Web Store submission.

## Steps

### Step 0: Update plan doc

Update `docs/planning/07-polish-and-assets.md` with this finalized plan.

### Step 1: Replace icon with "zzz" design

**File:** `scripts/generate-icons.ts`

Replace the embedded moon SVG with a "zzz" sleep-themed design. Keep the indigo background (`#4F46E5`, `rx="4"`). Use explicit `<path>` elements for three stacked Z letterforms (large, medium, small) in white — avoids font-rendering issues with Sharp.

Run `bun run generate-icons` to regenerate PNGs.

**Verify:** Visually inspect the generated icons in `public/` via Playwright.

### Step 2: Create ActiveView & ExpiredView preview endpoints

**Files:** `preview/active.html`, `preview/expired.html`

Copy `preview/index.html` and update the `window.browser` mock in each:

- **active.html** — `tabs.query` returns `[{ id: 1, url: '...' }]`; `runtime.sendMessage` returns a TimerState with `status: 'active'`, `durationMs: 30min`, `expiresAt: now + 27.5min`. This shows the countdown ring at ~27:30 remaining.
- **expired.html** — Same tabs mock; TimerState with `status: 'expired'`, `expiresAt` in the past.

**Verify:** Run `bun run dev:preview`, navigate to `/preview/active.html` and `/preview/expired.html` via Playwright, confirm correct views render.

### Step 3: Capture store screenshots

**Depends on:** Step 2

Use Playwright MCP to capture 3 screenshots at 1280x800:

1. `/preview/index.html` → `docs/screenshots/screenshot-idle.png`
2. `/preview/active.html` → `docs/screenshots/screenshot-active.png`
3. `/preview/expired.html` → `docs/screenshots/screenshot-expired.png`

**Verify:** Visually confirm each screenshot shows the correct UI state.

### Step 4: Version bump to 1.0.0

**File:** `package.json`

Change `"version": "0.0.0"` → `"version": "1.0.0"`. WXT reads version from package.json automatically.

**Verify:** Run `bun run build`, check `.output/chrome-mv3/manifest.json` contains `"version": "1.0.0"`.

### Step 5: Write store description

**File:** `docs/store-description.md`

Draft a Chrome Web Store listing description based on PROJECT.md. Cover: one-line summary, key features (timer, fade-out, presets, per-tab), privacy highlight.

**Verify:** Read and confirm it covers all features from PROJECT.md.

### Step 6: Write privacy policy

**File:** `docs/privacy-policy.md`

Cover:

- No personal data collection
- No data transmitted to external servers
- No analytics or tracking
- `chrome.storage.session` is ephemeral (clears on browser close)
- Media access limited to active tab when timer fires
- No third-party services

**Verify:** Cross-reference claims against actual permission usage in `wxt.config.ts`, `entrypoints/background.ts`, and `entrypoints/content.ts`.

### Step 7: Permissions audit

**File:** `docs/permissions-justification.md`

Document justification for each manifest permission:

- `storage` — Session-scoped timer state via `chrome.storage.session`
- `alarms` — Background timer scheduling
- `activeTab` — Current tab access for media control
- `scripting` — Content script injection for volume fade-out

**Verify:** Grep codebase to confirm each permission is actually used.

### Step 8: Build & zip

Run `bun run zip` to produce the distributable zip.

**Verify:** Confirm zip exists in `.output/`.

### Step 9: Mark plan doc complete

Update `docs/planning/07-polish-and-assets.md` to mark as complete.

## Critical Files

- `scripts/generate-icons.ts` — Icon SVG + generation
- `preview/index.html` — Template for new preview endpoints
- `entrypoints/popup/composables/useTimer.ts` — Mock contract (tabs.query + runtime.sendMessage)
- `package.json` — Version bump
- `wxt.config.ts` — Manifest/permissions reference

## Execution Order

Steps 0, 1, 2, 4, 5, 6, 7 are independent (parallelizable).
Step 3 depends on Step 2.
Step 8 depends on Steps 1 and 4.
Step 9 depends on all above.
