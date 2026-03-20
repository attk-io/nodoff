# Nodoff — Privacy Policy

**Effective Date:** March 20, 2026

## Overview

Nodoff is a browser extension that provides sleep timer functionality for audio and video content. This policy describes how Nodoff handles user data.

## Data Collection

Nodoff does **not** collect, store, or transmit any personal data.

- **No personal information** is collected at any time
- **No browsing history** is recorded or accessed beyond the active tab
- **No analytics or tracking** of any kind
- **No data is transmitted** to external servers — Nodoff operates entirely within your browser

## Local Storage

Nodoff uses `chrome.storage.session` to store timer state (duration, expiration time, and associated tab ID). This storage is:

- **Ephemeral** — all data is automatically cleared when the browser is closed
- **Local only** — data never leaves your device
- **Minimal** — only timer configuration is stored, no content or browsing data

## Permissions

Nodoff requests the following browser permissions, used exclusively for core functionality:

- **storage** — Save timer state for the current browser session
- **alarms** — Schedule timer expiration in the background
- **activeTab** — Access the current tab to manage media playback
- **scripting** — Inject the content script that performs volume fade-out and media pausing

No permission is used to access, collect, or transmit user data.

## Media Access

When a timer expires, Nodoff interacts with audio and video elements on the page solely to reduce volume and pause playback. No media content is recorded, captured, or transmitted.

## Third-Party Services

Nodoff does **not** use any third-party services, SDKs, or libraries that collect data.

## Changes to This Policy

Any changes to this privacy policy will be reflected in updated versions of the extension.

## Contact

For questions about this privacy policy, visit the extension's support page on the Chrome Web Store.
