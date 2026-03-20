<script setup lang="ts">
import { useTimer } from "./composables/useTimer";
import IdleView from "./components/IdleView.vue";
import ActiveView from "./components/ActiveView.vue";
import ExpiredView from "./components/ExpiredView.vue";

const { status, remainingMs, startTimer, cancelTimer, resetTimer } = useTimer();
</script>

<template>
  <div class="w-80 p-4">
    <header class="mb-4">
      <h1 class="text-lg font-semibold">
        Nodoff
      </h1>
      <p class="text-sm text-gray-500">
        Sleep timer for audio &amp; video
      </p>
    </header>

    <IdleView
      v-if="status === 'idle'"
      @start="startTimer"
    />
    <ActiveView
      v-else-if="status === 'active'"
      :remaining-ms="remainingMs"
      @cancel="cancelTimer"
    />
    <ExpiredView
      v-else-if="status === 'expired'"
      @reset="resetTimer"
    />
  </div>
</template>
