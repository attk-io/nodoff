<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  start: [durationMs: number];
}>();

const customMinutes = ref<number | null>(null);

const presets = [
  { label: "1m", minutes: 1 },
  { label: "15m", minutes: 15 },
  { label: "30m", minutes: 30 },
  { label: "45m", minutes: 45 },
  { label: "1h", minutes: 60 },
];

function startPreset(minutes: number) {
  emit("start", minutes * 60 * 1000);
}

function startCustom() {
  if (customMinutes.value == null || customMinutes.value < 1) return;
  const clamped = Math.min(customMinutes.value, 480);
  emit("start", clamped * 60 * 1000);
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        Quick start
      </p>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="preset in presets"
          :key="preset.label"
          class="cursor-pointer rounded-lg bg-gray-100 px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-100 hover:text-indigo-700 active:bg-indigo-200"
          @click="startPreset(preset.minutes)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <div>
      <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        Custom duration
      </p>
      <form
        class="flex gap-2"
        @submit.prevent="startCustom"
      >
        <input
          v-model.number="customMinutes"
          type="number"
          min="1"
          max="480"
          placeholder="Minutes"
          class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-300 focus:ring-1 focus:ring-indigo-300"
        >
        <button
          type="submit"
          :disabled="customMinutes == null || customMinutes < 1"
          class="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>
      </form>
    </div>
  </div>
</template>
