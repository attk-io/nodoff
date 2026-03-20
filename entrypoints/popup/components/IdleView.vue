<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  start: [durationMs: number];
}>();

const selectedIndex = ref<number | null>(null);
const minutes = ref<number | null>(null);
const inputFocused = ref(false);

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
const centerR = 57;
const gapDeg = 0;
const gapWidth = 3;
const total = presets.length;
const sectorDeg = 360 / total;
const startAngle = -90; // division between first and last sector at 12 o'clock

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

// Divider lines between sectors (uniform-width gaps)
const dividerLines = Array.from({ length: total }, (_, i) => {
  const angle = startAngle + i * sectorDeg;
  const inner = polarToXY(angle, innerR);
  const outer = polarToXY(angle, outerR);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
});

function selectSector(index: number) {
  if (inputFocused.value) return;
  selectedIndex.value = index;
  minutes.value = presets[index].minutes;
}

function onMinutesInput(event: globalThis.Event) {
  const target = event.target as globalThis.HTMLInputElement;
  const val = target.valueAsNumber;
  minutes.value = Number.isNaN(val) ? null : val;
  // Deselect preset if value doesn't match
  if (minutes.value !== null) {
    const match = presets.findIndex((p) => p.minutes === minutes.value);
    selectedIndex.value = match >= 0 ? match : null;
  }
}

function clampMinutes() {
  if (minutes.value !== null && minutes.value < 5) {
    minutes.value = 5;
  }
}

function startSelected() {
  if (minutes.value === null || minutes.value < 5) return;
  emit("start", minutes.value * 60 * 1000);
}
</script>

<template>
  <div class="flex justify-center animate-fade-up">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      class="w-full overflow-visible"
    >
      <!-- Sectors -->
      <path
        v-for="(preset, i) in presets"
        :key="preset.label"
        :d="sectorPath(i)"
        class="cursor-pointer transition-[fill,opacity] duration-200 ease-out-quart hover:fill-lavender"
        :class="{
          'fill-lavender': selectedIndex === i,
          'fill-surface-hover': selectedIndex !== i,
          'opacity-40': inputFocused,
        }"
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
        class="pointer-events-none fill-cream-muted text-[15px] font-light transition-[fill,opacity] duration-200 ease-out-quart"
        :class="{
          'fill-midnight': selectedIndex === i,
          'opacity-40': inputFocused,
        }"
        dominant-baseline="central"
        text-anchor="middle"
      >
        {{ preset.label }}
      </text>

      <!-- Divider lines (uniform-width gaps) -->
      <line
        v-for="(d, i) in dividerLines"
        :key="`div-${i}`"
        :x1="d.x1"
        :y1="d.y1"
        :x2="d.x2"
        :y2="d.y2"
        class="pointer-events-none stroke-midnight"
        :stroke-width="gapWidth"
      />

      <!-- Center circle (visual background) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="centerR"
        class="pointer-events-none transition-[fill] duration-200 ease-out-quart"
        :class="{
          'fill-lavender': minutes !== null,
          'fill-surface': minutes === null,
        }"
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
            <div>
              <input
                type="number"
                class="inline w-min border-none bg-transparent p-0 m-0 text-center text-cream text-[17px] font-medium tracking-[0.02em] font-[inherit] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none placeholder:text-cream-muted placeholder:text-sm placeholder:opacity-50 placeholder:text-[17px] placeholder:font-medium field-sizing-content"
                :class="{
                  'text-white': minutes !== null,
                }"
                :value="minutes"
                min="5"
                placeholder="0"
                aria-label="Timer duration in minutes"
                @input="onMinutesInput"
                @focus="inputFocused = true"
                @blur="
                  inputFocused = false;
                  clampMinutes();
                "
              ><span
                class="inline text-[17px] font-medium tracking-[0.02em] pointer-events-none"
                :class="{
                  'text-white': minutes !== null,
                  'text-cream-muted opacity-50': minutes === null,
                }"
              ><span class="relative top-[-0.05em]">:</span>00</span>
            </div>
          </div>
          <div
            class="h-0.5 w-full bg-white"
            :class="{
              'bg-white': minutes !== null,
            }"
          />
          <button
            class="flex flex-1 w-full cursor-pointer items-center justify-center border-none bg-transparent text-[9px] font-light uppercase tracking-[0.15em] font-[inherit] transition-opacity duration-200 ease-out-quart disabled:cursor-default disabled:opacity-50 not-disabled:hover:opacity-70"
            :class="{
              'text-white': minutes !== null,
            }"
            :disabled="minutes === null || minutes < 5"
            aria-label="Start timer"
            @click="startSelected"
          >
            Start
          </button>
        </div>
      </foreignObject>
    </svg>
  </div>
</template>
