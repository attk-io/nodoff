# Phase 1: Project Scaffolding

**Status: Complete**

**Goal:** Buildable extension skeleton that loads in Chrome with an empty popup.

## Key Decisions

| Decision       | Choice                    | Rationale                                                                          |
| -------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| Timer key      | **tabId** (not URL)       | Simpler cleanup via `tabs.onRemoved`. Two tabs on same URL get independent timers. |
| Icons          | **Heroicons** (moon icon) | Clean, MIT-licensed, consistent with modern design                                 |
| Bun management | **mise**                  | Consistent toolchain versioning across environments                                |

## Steps

### 0. Update this planning doc

Keep planning docs in sync with what we're actually implementing.

### 1. Set up Bun via mise

```bash
mise use bun
```

### 2. Scaffold WXT project with Vue template

```bash
bun create wxt@latest . --template vue
```

### 3. Install additional dependencies

```bash
bun add -D tailwindcss @tailwindcss/vite
```

### 4. Configure `wxt.config.ts`

- Extension name: `"Nodoff"`
- Description: `"Sleep timer that pauses audio/video after a configurable timeout"`
- Permissions: `["storage", "alarms", "activeTab", "scripting"]`
- Tailwind Vite plugin integration

### 5. Set up Tailwind CSS

- Create `assets/main.css` with `@import "tailwindcss"`
- Import in popup's `main.ts`

### 6. Create/update placeholder entrypoints

- `entrypoints/popup/index.html` + `main.ts` + `App.vue` (popup shell)
- `entrypoints/background.ts` (empty background service worker)
- `entrypoints/content.ts` (empty content script with match pattern)

### 7. Add extension icon from Heroicons

Download Heroicons `moon` SVG, convert to PNG at 16, 32, 48, 128px sizes in `public/`.

### 8. Install and configure project tooling

- **Prettier** — `.prettierrc` with project defaults
- **ESLint** — `eslint.config.js` (flat config) with TS + Vue rules
- **lint-staged** — format + lint staged files
- **Husky** — pre-commit hook runs lint-staged + type-check
- **Scripts** — `fmt`, `lint`, `type-check`

### 9. Update PROJECT.md

Change timer key references from "URL" to "tabId".

### 10. Confirm build and load

```bash
bun run dev
```

Build succeeds, `.output/chrome-mv3-dev` directory is created, extension loads in Chrome.

## Verification

- `bun run dev` produces a loadable extension in `.output/chrome-mv3-dev`
- `bun run fmt`, `bun run lint`, `bun run type-check` all pass
- Husky pre-commit hook is configured
- Popup opens when extension icon is clicked
