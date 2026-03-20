<script setup lang="ts">
import { computed } from "vue";

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
  <div class="flex flex-col items-center space-y-4">
    <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
      Time remaining
    </p>
    <p class="text-4xl font-bold tabular-nums text-gray-800">
      {{ display }}
    </p>
    <button
      class="w-full cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-red-100 hover:text-red-700 active:bg-red-200"
      @click="emit('cancel')"
    >
      Cancel
    </button>
  </div>
</template>
