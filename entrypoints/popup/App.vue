<script setup lang="ts">
import { computed } from "vue";
import { useTimer } from "./composables/useTimer";
import { useTheme } from "./composables/useTheme";
import IdleView from "./components/IdleView.vue";
import ActiveView from "./components/ActiveView.vue";
import ExpiredView from "./components/ExpiredView.vue";

const { status, remainingMs, timerState, startTimer, cancelTimer, resetTimer } =
  useTimer();

const durationMs = computed(() => timerState.value?.durationMs ?? 0);
const { theme, toggle } = useTheme();
</script>

<template>
  <div
    class="w-80 bg-midnight px-6 pt-6 pb-8 font-['Outfit'] transition-colors duration-300"
  >
    <header class="mb-8 flex items-start justify-between animate-fade-in">
      <div>
        <h1
          class="font-['Fraunces'] text-2xl font-light tracking-tight text-cream"
          style="
            font-variation-settings:
              &quot;SOFT&quot; 100,
              &quot;WONK&quot; 1;
          "
        >
          nodoff
        </h1>
        <p
          class="mt-1 text-xs font-light tracking-widest uppercase text-lavender-dim"
        >
          Sleep timer
        </p>
      </div>

      <button
        class="relative mt-1 flex h-7 w-14 cursor-pointer items-center rounded-full bg-surface transition-colors duration-200 hover:bg-surface-hover"
        :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
        role="switch"
        :aria-checked="theme === 'dark'"
        @click="toggle"
      >
        <!-- Sliding handle -->
        <span
          class="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform duration-300 ease-out-quart"
          :class="theme === 'dark' ? 'translate-x-7' : 'translate-x-0'"
        />
        <!-- Sun icon (left) -->
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="relative z-10 ml-[0.4375rem] transition-colors duration-200"
          :class="theme === 'light' ? 'text-lavender' : 'text-cream-muted'"
        >
          <circle
            cx="12"
            cy="12"
            r="5"
          />
          <line
            x1="12"
            y1="1"
            x2="12"
            y2="3"
          />
          <line
            x1="12"
            y1="21"
            x2="12"
            y2="23"
          />
          <line
            x1="4.22"
            y1="4.22"
            x2="5.64"
            y2="5.64"
          />
          <line
            x1="18.36"
            y1="18.36"
            x2="19.78"
            y2="19.78"
          />
          <line
            x1="1"
            y1="12"
            x2="3"
            y2="12"
          />
          <line
            x1="21"
            y1="12"
            x2="23"
            y2="12"
          />
          <line
            x1="4.22"
            y1="19.78"
            x2="5.64"
            y2="18.36"
          />
          <line
            x1="18.36"
            y1="5.64"
            x2="19.78"
            y2="4.22"
          />
        </svg>
        <!-- Moon icon (right) -->
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="relative z-10 ml-auto mr-[0.4375rem] transition-colors duration-200"
          :class="theme === 'dark' ? 'text-lavender' : 'text-cream-muted'"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </header>

    <IdleView
      v-if="status === 'idle'"
      @start="startTimer"
    />
    <ActiveView
      v-else-if="status === 'active'"
      :remaining-ms="remainingMs"
      :duration-ms="durationMs"
      @cancel="cancelTimer"
    />
    <ExpiredView
      v-else-if="status === 'expired'"
      @reset="resetTimer"
    />
  </div>
</template>
