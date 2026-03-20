import type { TimerState, Message } from "~/types";

// --- WXT Storage Items (session-scoped) ---

const timersStorage = storage.defineItem<Record<string, TimerState>>(
  "session:timers",
  { fallback: {} },
);

const lastTimerTabIdStorage = storage.defineItem<number | null>(
  "session:lastTimerTabId",
  { fallback: null },
);

// --- Badge Management ---

async function updateBadge(tabId: number): Promise<void> {
  const timers = await timersStorage.getValue();
  const timer = timers[String(tabId)];

  try {
    if (timer && timer.status === "active") {
      await browser.action.setBadgeText({ text: "●", tabId });
      await browser.action.setBadgeBackgroundColor({ color: "#22c55e", tabId });
    } else {
      await browser.action.setBadgeText({ text: "", tabId });
    }
  } catch {
    // Tab may no longer exist
  }
}

// --- Timer Operations ---

async function startTimer(
  tabId: number,
  url: string,
  durationMs: number,
): Promise<TimerState> {
  const now = Date.now();
  const expiresAt = now + durationMs;

  const timerState: TimerState = {
    tabId,
    url,
    status: "active",
    durationMs,
    expiresAt,
    createdAt: now,
  };

  const timers = await timersStorage.getValue();
  timers[String(tabId)] = timerState;
  await timersStorage.setValue(timers);

  await browser.alarms.create(`timer-${tabId}`, { when: expiresAt });
  await lastTimerTabIdStorage.setValue(tabId);
  await updateBadge(tabId);

  return timerState;
}

async function cancelTimer(tabId: number): Promise<void> {
  const timers = await timersStorage.getValue();
  delete timers[String(tabId)];
  await timersStorage.setValue(timers);

  await browser.alarms.clear(`timer-${tabId}`);

  const lastTabId = await lastTimerTabIdStorage.getValue();
  if (lastTabId === tabId) {
    await lastTimerTabIdStorage.setValue(null);
  }

  await updateBadge(tabId);
}

// --- Background Entry Point ---

export default defineBackground(() => {
  // --- Service Worker Recovery ---

  (async () => {
    const timers = await timersStorage.getValue();
    const now = Date.now();
    let updated = false;

    for (const [key, timer] of Object.entries(timers)) {
      if (timer.status !== "active") continue;

      if (timer.expiresAt <= now) {
        // Past-due: mark expired and attempt fade out
        timers[key] = { ...timer, status: "expired" };
        updated = true;

        try {
          await browser.tabs.sendMessage(timer.tabId, { type: "FADE_OUT" });
        } catch {
          // Tab may have navigated away or been closed
        }
      } else {
        // Still active: re-register alarm
        await browser.alarms.create(`timer-${timer.tabId}`, {
          when: timer.expiresAt,
        });
      }
    }

    if (updated) {
      await timersStorage.setValue(timers);
    }
  })();

  // --- Alarm Listener ---

  browser.alarms.onAlarm.addListener(async (alarm) => {
    const match = alarm.name.match(/^timer-(\d+)$/);
    if (!match) return;

    const tabId = Number(match[1]);
    const timers = await timersStorage.getValue();
    const timer = timers[String(tabId)];

    if (timer) {
      timers[String(tabId)] = { ...timer, status: "expired" };
      await timersStorage.setValue(timers);
    }

    try {
      await browser.tabs.sendMessage(tabId, { type: "FADE_OUT" });
    } catch {
      // Tab may have navigated away
    }

    await updateBadge(tabId);
  });

  // --- Message Listener ---

  browser.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      (async () => {
        switch (message.type) {
          case "START_TIMER": {
            const state = await startTimer(
              message.tabId,
              message.url,
              message.durationMs,
            );
            sendResponse({ type: "TIMER_STATE", state });
            break;
          }

          case "CANCEL_TIMER": {
            await cancelTimer(message.tabId);
            sendResponse({ type: "TIMER_STATE", state: null });
            break;
          }

          case "GET_TIMER_STATE": {
            const timers = await timersStorage.getValue();
            const state = timers[String(message.tabId)] ?? null;
            sendResponse({ type: "TIMER_STATE", state });
            break;
          }
        }
      })();

      return true; // Indicate async response
    },
  );

  // --- Tab Cleanup ---

  browser.tabs.onRemoved.addListener(async (tabId) => {
    const timers = await timersStorage.getValue();

    if (timers[String(tabId)]) {
      delete timers[String(tabId)];
      await timersStorage.setValue(timers);
      await browser.alarms.clear(`timer-${tabId}`);
    }

    const lastTabId = await lastTimerTabIdStorage.getValue();
    if (lastTabId === tabId) {
      await lastTimerTabIdStorage.setValue(null);
    }
  });

  // --- Tab Activation (Badge Update) ---

  browser.tabs.onActivated.addListener(async (activeInfo) => {
    await updateBadge(activeInfo.tabId);
  });
});
