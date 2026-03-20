<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  remainingMs: number;
}>();

const emit = defineEmits<{
  cancel: [];
}>();

const display = computed(() => {
  const totalSeconds = Math.ceil(props.remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    const hh = String(hours).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  return `${mm}:${ss}`;
});
</script>

<template>
  <div class="flex flex-col items-center space-y-6">
    <p
      class="animate-fade-in text-[0.65rem] font-medium uppercase tracking-[0.2em] text-lavender-dim"
    >
      Time remaining
    </p>

    <div class="relative animate-fade-up">
      <!-- Breathing glow behind timer -->
      <div
        class="absolute inset-0 -inset-x-8 -inset-y-4 animate-breathe rounded-full bg-lavender-glow blur-2xl"
        aria-hidden="true"
      />
      <p
        class="relative font-['Fraunces'] text-6xl font-extralight tabular-nums text-cream"
        style="
          font-variation-settings:
            &quot;SOFT&quot; 100,
            &quot;WONK&quot; 1;
        "
      >
        {{ display }}
      </p>
    </div>

    <BaseButton
      variant="danger"
      class="animate-fade-up w-full"
      style="animation-delay: 100ms"
      @click="emit('cancel')"
    >
      Cancel
    </BaseButton>
  </div>
</template>
