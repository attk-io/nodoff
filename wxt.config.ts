import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    name: "Nodoff",
    description:
      "Sleep timer that pauses audio/video after a configurable timeout",
    permissions: ["storage", "alarms", "activeTab", "scripting"],
    icons: {
      "16": "/icon-16.png",
      "32": "/icon-32.png",
      "48": "/icon-48.png",
      "128": "/icon-128.png",
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
