import { ref, computed, onMounted, onUnmounted } from "vue";
import type { TimerState, TimerStateResponse } from "~/types";

const timersStorage = storage.defineItem<Record<string, TimerState>>(
  "session:timers",
  { fallback: {} },
);

export function useTimer() {
  const timerState = ref<TimerState | null>(null);
  const remainingMs = ref(0);
  const tabId = ref<number | null>(null);
  const tabUrl = ref<string>("");

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let unwatchStorage: (() => void) | null = null;

  const status = computed(() => timerState.value?.status ?? "idle");

  function updateRemaining() {
    if (timerState.value?.status === "active") {
      remainingMs.value = Math.max(0, timerState.value.expiresAt - Date.now());
    } else {
      remainingMs.value = 0;
    }
  }

  async function fetchState() {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id || !tab.url) return;

      tabId.value = tab.id;
      tabUrl.value = tab.url;

      const response: TimerStateResponse = await browser.runtime.sendMessage({
        type: "GET_TIMER_STATE",
        tabId: tab.id,
      });

      timerState.value = response.state;
      updateRemaining();
    } catch {
      // Extension context may not be available (e.g. opened as file://)
    }
  }

  async function startTimer(durationMs: number) {
    if (tabId.value == null) return;

    try {
      const response: TimerStateResponse = await browser.runtime.sendMessage({
        type: "START_TIMER",
        tabId: tabId.value,
        url: tabUrl.value,
        durationMs,
      });

      timerState.value = response.state;
      updateRemaining();
    } catch {
      // Extension context unavailable
    }
  }

  async function cancelTimer() {
    if (tabId.value == null) return;

    try {
      await browser.runtime.sendMessage({
        type: "CANCEL_TIMER",
        tabId: tabId.value,
      });

      timerState.value = null;
      remainingMs.value = 0;
    } catch {
      // Extension context unavailable
    }
  }

  async function resetTimer() {
    await cancelTimer();
  }

  onMounted(() => {
    fetchState();

    intervalId = setInterval(updateRemaining, 100);

    try {
      unwatchStorage = timersStorage.watch((timers) => {
        if (tabId.value == null) return;
        const state = timers[String(tabId.value)] ?? null;
        timerState.value = state;
        updateRemaining();
      });
    } catch {
      // Storage watch may not be available outside extension context
    }
  });

  onUnmounted(() => {
    if (intervalId != null) {
      clearInterval(intervalId);
    }

    if (unwatchStorage != null) {
      unwatchStorage();
    }
  });

  return {
    timerState,
    status,
    remainingMs,
    startTimer,
    cancelTimer,
    resetTimer,
  };
}
