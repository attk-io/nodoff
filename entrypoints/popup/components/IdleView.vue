<script setup lang="ts">
import { ref, computed } from "vue";

const emit = defineEmits<{
  start: [durationMs: number];
}>();

const selectedIndex = ref<number | null>(null);

const presets = [
  { label: "15m", minutes: 15 },
  { label: "30m", minutes: 30 },
  { label: "45m", minutes: 45 },
  { label: "1hr", minutes: 60 },
  { label: "2hr", minutes: 120 },
];

const size = 280;
const cx = size / 2;
const cy = size / 2;
const outerR = 132;
const innerR = 60;
const centerR = 50;
const gapDeg = 3.5;
const total = presets.length;
const sectorDeg = 360 / total;
const startAngle = -90 - sectorDeg / 2; // first sector centered at 12 o'clock

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToXY(angleDeg: number, r: number) {
  return {
    x: cx + r * Math.cos(degToRad(angleDeg)),
    y: cy + r * Math.sin(degToRad(angleDeg)),
  };
}

function sectorPath(index: number): string {
  const start = startAngle + index * sectorDeg + gapDeg / 2;
  const end = start + sectorDeg - gapDeg;

  const os = polarToXY(start, outerR);
  const oe = polarToXY(end, outerR);
  const is_ = polarToXY(start, innerR);
  const ie = polarToXY(end, innerR);

  const large = sectorDeg - gapDeg > 180 ? 1 : 0;

  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${is_.x} ${is_.y}`,
    "Z",
  ].join(" ");
}

function sectorLabelPos(index: number) {
  const midAngle = startAngle + index * sectorDeg + sectorDeg / 2;
  const midR = (innerR + outerR) / 2;
  return polarToXY(midAngle, midR);
}

const centerText = computed(() => {
  if (selectedIndex.value === null) return null;
  const m = presets[selectedIndex.value].minutes;
  return `${String(m).padStart(2, "0")}:00`;
});

function selectSector(index: number) {
  selectedIndex.value = index;
}

function startSelected() {
  if (selectedIndex.value === null) return;
  emit("start", presets[selectedIndex.value].minutes * 60 * 1000);
}
</script>

<template>
  <div class="radial-menu animate-fade-up">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      class="radial-svg w-full"
    >
      <!-- Sectors -->
      <path
        v-for="(preset, i) in presets"
        :key="preset.label"
        :d="sectorPath(i)"
        :class="['sector', { 'sector--selected': selectedIndex === i }]"
        role="option"
        :aria-label="`${preset.label} timer`"
        :aria-selected="selectedIndex === i"
        @mouseenter="selectSector(i)"
        @click="selectSector(i)"
      />

      <!-- Sector labels -->
      <text
        v-for="(preset, i) in presets"
        :key="`label-${preset.label}`"
        :x="sectorLabelPos(i).x"
        :y="sectorLabelPos(i).y"
        class="sector-label"
        :class="{ 'sector-label--selected': selectedIndex === i }"
        dominant-baseline="central"
        text-anchor="middle"
      >
        {{ preset.label }}
      </text>

      <!-- Center circle -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="centerR"
        :class="[
          'center-circle',
          { 'center-circle--active': selectedIndex !== null },
        ]"
        :role="selectedIndex !== null ? 'button' : undefined"
        :aria-label="
          selectedIndex !== null
            ? `Start ${presets[selectedIndex].label} timer`
            : undefined
        "
        :style="{ pointerEvents: selectedIndex !== null ? 'auto' : 'none' }"
        @click="startSelected"
      />

      <!-- Center text: idle -->
      <text
        v-if="selectedIndex === null"
        :x="cx"
        :y="cy"
        class="center-text-idle"
        dominant-baseline="central"
        text-anchor="middle"
      >
        Select
      </text>

      <!-- Center text: selected -->
      <g
        v-if="selectedIndex !== null"
        :style="{ pointerEvents: 'none' }"
      >
        <text
          :x="cx"
          :y="cy - 16"
          class="center-text-sub"
          dominant-baseline="central"
          text-anchor="middle"
        >
          start
        </text>
        <text
          :x="cx"
          :y="cy + 2"
          class="center-text-time"
          dominant-baseline="central"
          text-anchor="middle"
        >
          {{ centerText }}
        </text>
        <text
          :x="cx"
          :y="cy + 20"
          class="center-text-sub"
          dominant-baseline="central"
          text-anchor="middle"
        >
          timer
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.radial-menu {
  display: flex;
  justify-content: center;
}

.radial-svg {
  overflow: visible;
}

/* ── Sectors ── */
.sector {
  fill: var(--color-surface-hover);
  cursor: pointer;
  transition: fill 200ms var(--ease-out-quart);
}

.sector:hover,
.sector--selected {
  fill: var(--color-lavender);
}

/* ── Sector labels ── */
.sector-label {
  fill: var(--color-cream-muted);
  font-size: 15px;
  font-weight: 300;
  pointer-events: none;
  transition: fill 200ms var(--ease-out-quart);
}

.sector-label--selected {
  fill: var(--color-midnight);
}

/* ── Center circle ── */
.center-circle {
  fill: var(--color-surface);
  cursor: default;
  transition:
    fill 200ms var(--ease-out-quart),
    transform 200ms var(--ease-out-quart);
}

.center-circle--active {
  fill: var(--color-lavender);
  cursor: pointer;
}

/* ── Center text ── */
.center-text-idle {
  fill: var(--color-cream-muted);
  font-size: 14px;
  font-weight: 300;
  pointer-events: none;
}

.center-text-time {
  fill: var(--color-cream);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0.02em;
  pointer-events: none;
}

.center-text-sub {
  fill: var(--color-cream);
  font-size: 9px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  pointer-events: none;
}
</style>
