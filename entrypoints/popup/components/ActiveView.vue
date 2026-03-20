<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  remainingMs: number;
  durationMs: number;
}>();

const emit = defineEmits<{
  cancel: [];
}>();

// ── Display ──
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

// ── Radial geometry (matches IdleView) ──
const size = 280;
const cx = size / 2;
const cy = size / 2;
const outerR = 132;
const innerR = 60;
const centerR = 50;
const sectorCount = 5;
const sectorDeg = 360 / sectorCount;
const startAngle = -90;
const gapWidth = 5;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToXY(angleDeg: number, r: number) {
  return {
    x: cx + r * Math.cos(degToRad(angleDeg)),
    y: cy + r * Math.sin(degToRad(angleDeg)),
  };
}

// ── Progress ring ──
const ringGap = 6;
const ringWidth = 14;
const ringR = outerR + ringGap + ringWidth / 2;
const ringOuterEdge = ringR + ringWidth / 2;

// Divider lines between sectors — extend through the progress ring
const dividerLines = Array.from({ length: sectorCount }, (_, i) => {
  const angle = startAngle + i * sectorDeg;
  const inner = polarToXY(angle, innerR);
  const outer = polarToXY(angle, ringOuterEdge);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
});
const ringCircumference = 2 * Math.PI * ringR;

const progress = computed(() => {
  if (props.durationMs <= 0) return 0;
  return Math.max(0, Math.min(1, props.remainingMs / props.durationMs));
});

const ringOffset = computed(() => {
  return -(ringCircumference * (1 - progress.value));
});

// Expand viewBox to fit the outer progress ring
const viewPad = 16;
const viewSize = size + viewPad * 2;
const viewBox = `${-viewPad} ${-viewPad} ${viewSize} ${viewSize}`;
</script>

<template>
  <div class="radial-timer animate-fade-up">
    <svg
      :viewBox="viewBox"
      class="radial-svg w-full"
    >
      <!-- Progress ring: background track (grey) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="ringR"
        class="progress-ring-track"
      />

      <!-- Progress ring: active (mint) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="ringR"
        class="progress-ring"
        :stroke-dasharray="ringCircumference"
        :stroke-dashoffset="ringOffset"
        :transform="`rotate(-90 ${cx} ${cy})`"
      />

      <!-- Donut ring (single shape) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="(outerR + innerR) / 2"
        class="donut-ring"
        :stroke-width="outerR - innerR"
      />

      <!-- Divider lines (simulate gaps) -->
      <line
        v-for="(d, i) in dividerLines"
        :key="i"
        :x1="d.x1"
        :y1="d.y1"
        :x2="d.x2"
        :y2="d.y2"
        class="divider"
        :stroke-width="gapWidth"
      />

      <!-- Center circle (stop button) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="centerR"
        class="center-circle"
        role="button"
        aria-label="Stop timer"
        @click="emit('cancel')"
      />

      <!-- Center text -->
      <g style="pointer-events: none">
        <text
          :x="cx"
          :y="cy - 14"
          class="center-text-sub"
          dominant-baseline="central"
          text-anchor="middle"
        >
          stop
        </text>
        <text
          :x="cx"
          :y="cy + 8"
          class="center-text-time"
          dominant-baseline="central"
          text-anchor="middle"
        >
          {{ display }}
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.radial-timer {
  display: flex;
  justify-content: center;
}

.radial-svg {
  overflow: visible;
}

/* ── Progress ring ── */
.progress-ring-track {
  fill: none;
  stroke: var(--color-surface-hover);
  stroke-width: 14;
}

.progress-ring {
  fill: none;
  stroke: var(--color-mint);
  stroke-width: 14;
  stroke-linecap: butt;
  transition: stroke-dashoffset 1s linear;
}

/* ── Donut ring ── */
.donut-ring {
  fill: none;
  stroke: var(--color-surface-hover);
}

.divider {
  stroke: var(--color-midnight);
  pointer-events: none;
}

/* ── Center circle ── */
.center-circle {
  fill: var(--color-mint);
  cursor: pointer;
  transition: fill 200ms var(--ease-out-quart);
}

.center-circle:hover {
  fill: var(--color-mint-soft);
}

/* ── Center text ── */
.center-text-time {
  fill: var(--color-cream);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.center-text-sub {
  fill: var(--color-cream);
  font-size: 9px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
</style>
