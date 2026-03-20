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
const centerR = 57;
const dividerCount = 5;
const dividerDeg = 360 / dividerCount;
const sliceCount = 600;
const sliceDeg = 360 / sliceCount;
const startAngle = -90;
const gapWidth = 3;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToXY(angleDeg: number, r: number) {
  return {
    x: cx + r * Math.cos(degToRad(angleDeg)),
    y: cy + r * Math.sin(degToRad(angleDeg)),
  };
}

function slicePath(index: number): string {
  const start = startAngle + index * sliceDeg;
  const end = start + sliceDeg;

  const os = polarToXY(start, outerR);
  const oe = polarToXY(end, outerR);
  const is_ = polarToXY(start, innerR);
  const ie = polarToXY(end, innerR);

  const large = sliceDeg > 180 ? 1 : 0;

  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${is_.x} ${is_.y}`,
    "Z",
  ].join(" ");
}

// ── Progress ring ──
const ringGap = 3;
const ringWidth = 3;
const ringR = outerR + ringGap + ringWidth / 2;
const ringOuterEdge = ringR + ringWidth / 2;

// Divider lines between sectors — extend through the progress ring
const dividerLines = Array.from({ length: dividerCount }, (_, i) => {
  const angle = startAngle + i * dividerDeg;
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

// Active slice with trailing glow: moves clockwise, one per second, full rotation = 60s
const activeSlice = computed(() => {
  const elapsedTicks = Math.floor((props.durationMs - props.remainingMs) / 100);
  return elapsedTicks % sliceCount;
});

const tailLength = 50;
const minOpacity = 0.33;
const maxOpacity = 0.66;

function sliceOpacity(index: number): number {
  const distance = (activeSlice.value - index + sliceCount) % sliceCount;
  if (distance > tailLength) return minOpacity;
  const t = 1 - distance / tailLength;
  return minOpacity + (maxOpacity - minOpacity) * t;
}

// Expand viewBox to fit the outer progress ring
const viewPad = Math.max(0, Math.ceil(ringOuterEdge - size / 2));
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

      <!-- Donut slices -->
      <path
        v-for="i in sliceCount"
        :key="`slice-${i}`"
        :d="slicePath(i - 1)"
        class="donut-sector"
        :style="{ opacity: sliceOpacity(i - 1) }"
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

      <!-- Center circle (visual background) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="centerR"
        class="center-circle pointer-events-none"
      />

      <!-- Center interactive content -->
      <foreignObject
        :x="cx - centerR"
        :y="cy - centerR"
        :width="centerR * 2"
        :height="centerR * 2"
      >
        <div
          class="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full py-2"
        >
          <div
            class="flex flex-1 w-full items-center justify-center text-center"
          >
            <span class="text-white text-[17px] font-medium tracking-[0.02em]">
              {{ display }}
            </span>
          </div>
          <div class="h-px w-[75%] opacity-40 bg-white" />
          <button
            class="flex flex-1 w-full cursor-pointer items-center justify-center border-none bg-transparent text-white text-[9px] font-light uppercase tracking-[0.15em] font-[inherit] transition-opacity duration-200 ease-out-quart hover:opacity-70"
            aria-label="Stop timer"
            @click="emit('cancel')"
          >
            Stop
          </button>
        </div>
      </foreignObject>
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
  stroke-width: 3;
}

.progress-ring {
  fill: none;
  stroke: var(--color-mint);
  stroke-width: 3;
  stroke-linecap: butt;
  transition: stroke-dashoffset 1s linear;
}

/* ── Donut ring ── */
.donut-sector {
  fill: var(--color-surface-hover);
  transition: opacity 0.1s ease-out;
}

.divider {
  stroke: var(--color-midnight);
  pointer-events: none;
}

/* ── Center circle ── */
.center-circle {
  fill: var(--color-mint);
  transition: fill 200ms var(--ease-out-quart);
}
</style>
