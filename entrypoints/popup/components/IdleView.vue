<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";

const emit = defineEmits<{
  start: [durationMs: number];
}>();

const customMinutes = ref<number | null>(null);

const presets = [
  { label: "15m", minutes: 15 },
  { label: "30m", minutes: 30 },
  { label: "45m", minutes: 45 },
  { label: "1h", minutes: 60 },
  { label: "2h", minutes: 120 },
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
  <div class="space-y-6">
    <div class="animate-fade-up">
      <p
        class="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-lavender"
      >
        Quick start
      </p>
      <div class="grid grid-cols-5 gap-2">
        <BaseButton
          v-for="(preset, i) in presets"
          :key="preset.label"
          :style="{ animationDelay: `${100 + i * 50}ms` }"
          class="animate-fade-up"
          @click="startPreset(preset.minutes)"
        >
          {{ preset.label }}
        </BaseButton>
      </div>
    </div>

    <div
      class="animate-fade-up"
      style="animation-delay: 200ms"
    >
      <p
        class="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-lavender"
      >
        Custom
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
          class="w-full rounded-full border border-surface-hover bg-surface px-4 py-2.5 text-sm font-light text-cream placeholder:text-lavender outline-none transition-colors duration-200 focus:border-lavender focus:bg-surface-hover"
        >
        <!-- <BaseButton
          type="submit"
          :disabled="customMinutes !== null || customMinutes > 1"
        >
          Start
        </BaseButton> -->
        <BaseButton
          type="submit"
          class="w-full"
        >
          Start
        </BaseButton>
      </form>
    </div>
  </div>
</template>
