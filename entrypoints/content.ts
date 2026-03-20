import type { Message } from "~/types/messages";

let fadeInterval: ReturnType<typeof setInterval> | null = null;

function fadeOutAndPause(): void {
  if (fadeInterval !== null) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
  const elements = document.querySelectorAll<
    HTMLAudioElement | HTMLVideoElement
  >("audio, video");

  const active = Array.from(elements).filter((el) => !el.paused);
  if (active.length === 0) return;

  const startVolumes = active.map((el) => el.volume);
  const totalSteps = 100;
  let step = 0;

  fadeInterval = setInterval(() => {
    step++;

    for (let i = 0; i < active.length; i++) {
      try {
        active[i].volume = startVolumes[i] * (1 - step / totalSteps);
      } catch {
        // Element may have been removed from DOM
      }
    }

    if (step >= totalSteps) {
      clearInterval(fadeInterval!);
      fadeInterval = null;
      for (const el of active) {
        try {
          el.pause();
        } catch {
          // Element may have been removed from DOM
        }
      }
    }
  }, 100);
}

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    browser.runtime.onMessage.addListener((message: Message) => {
      if (message.type === "FADE_OUT") {
        fadeOutAndPause();
      }
    });
  },
});
