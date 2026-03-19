# Nodoff — Implementation Plan Overview

Nodoff is a greenfield Chrome extension that pauses audio/video after a configurable sleep timer. This plan covers everything from scaffolding through Chrome Web Store release.

## Key Decisions

| Decision        | Choice                                                             | Rationale                                                                          |
| --------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Build framework | **WXT** (Vite under the hood)                                      | CRXJS abandoned, vite-plugin-web-extension deprecated. WXT is the successor.       |
| Timer key       | **tabId**                                                          | Simpler cleanup via `tabs.onRemoved`. Two tabs on same URL get independent timers. |
| Timer engine    | **chrome.alarms** + stored expiry timestamps                       | MV3 service workers are ephemeral; `setTimeout` is unreliable.                     |
| Badge           | **Yes** — show remaining minutes for current/last-active timer tab | Updates on tab switch. Shows last timer tab's time if current tab has no timer.    |

## Phases

1. [Project Scaffolding](./01-project-scaffolding.md)
2. [Type Definitions](./02-type-definitions.md)
3. [Background Service Worker](./03-background-service-worker.md)
4. [Content Script](./04-content-script.md)
5. [Popup Vue Application](./05-popup-vue-application.md)
6. [Integration Testing & QA](./06-integration-testing.md)
7. [Polish & Store Assets](./07-polish-and-assets.md)
8. [Chrome Web Store Submission](./08-chrome-web-store-submission.md)
