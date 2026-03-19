export type TimerStatus = "idle" | "active" | "expired";

export interface TimerState {
  tabId: number;
  url: string;
  status: TimerStatus;
  durationMs: number;
  expiresAt: number;
  createdAt: number;
}
