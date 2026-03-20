<script setup lang="ts">
import { useTimer } from "./composables/useTimer";
import { useTheme } from "./composables/useTheme";
import IdleView from "./components/IdleView.vue";
import ActiveView from "./components/ActiveView.vue";
import ExpiredView from "./components/ExpiredView.vue";

const { status, remainingMs, startTimer, cancelTimer, resetTimer } = useTimer();
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
        class="mt-1 flex cursor-pointer items-center gap-1.5 rounded-full bg-surface px-2 py-1 transition-colors duration-200 hover:bg-surface-hover"
        :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
        @click="toggle"
      >
        <!-- Sun -->
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-colors duration-200"
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
        <!-- Moon -->
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-colors duration-200"
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
      @cancel="cancelTimer"
    />
    <ExpiredView
      v-else-if="status === 'expired'"
      @reset="resetTimer"
    />
  </div>
</template>
