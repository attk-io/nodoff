# Phase 6: Integration Testing & QA

**Goal:** Confirm end-to-end behavior across edge cases.

## Test Matrix

| #   | Scenario                               | Expected                                                 |
| --- | -------------------------------------- | -------------------------------------------------------- |
| 1   | Set 1-min timer on YouTube             | Volume fades over 10s, video pauses, popup shows expired |
| 2   | Timers on two different tabs           | Each expires independently                               |
| 3   | Page refresh with active timer         | Timer persists, popup still shows countdown              |
| 4   | Close tab with active timer            | Timer removed from storage, alarm cleared                |
| 5   | Terminate service worker mid-timer     | Timer still fires on schedule after worker restarts      |
| 6   | Timer expires on page with no media    | Expires gracefully, no console errors                    |
| 7   | Custom duration input (bounds)         | Rejects <1 and >480, accepts valid values                |
| 8   | Cancel timer mid-countdown             | Alarm cleared, state resets to idle                      |
| 9   | Badge shows correct time on tab switch | Shows current tab's timer, falls back to last timer tab  |

## Verification

All 9 scenarios pass without console errors.
