# Nodoff

A Chrome extension sleep timer that automatically pauses audio or video after a configurable timeout.

## Features

- **Sleep Timer** — Pauses any audio or video on a page after a user-configured timeout
- **Smooth Volume Fade-Out** — Volume scales down to 0 over a 10-second period before pausing media
- **Preset & Custom Timers** — Quick-select presets (15m, 30m, 45m, 1h) plus a custom duration input
- **Per-Tab Timers** — Each tab can have its own independent timer
- **Session Persistence** — Timer state survives page refresh but clears when the tab or browser closes

## Roadmap

- Spotify support (coming soon)

## Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build
```

## Install Locally

1. Run `npm run build`
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/chrome-mv3` directory
