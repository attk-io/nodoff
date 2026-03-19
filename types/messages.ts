import type { TimerState } from "./timer";

export interface StartTimerMessage {
  type: "START_TIMER";
  durationMs: number;
  tabId: number;
  url: string;
}

export interface CancelTimerMessage {
  type: "CANCEL_TIMER";
  tabId: number;
}

export interface GetTimerStateMessage {
  type: "GET_TIMER_STATE";
  tabId: number;
}

export interface TimerStateResponse {
  type: "TIMER_STATE";
  state: TimerState | null;
}

export interface FadeOutMessage {
  type: "FADE_OUT";
}

export type Message =
  | StartTimerMessage
  | CancelTimerMessage
  | GetTimerStateMessage
  | TimerStateResponse
  | FadeOutMessage;
