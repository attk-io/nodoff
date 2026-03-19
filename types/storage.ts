import type { TimerState } from "./timer";

export interface SessionStorageSchema {
  timers: Record<string, TimerState>;
  lastTimerTabId: number | null;
}
