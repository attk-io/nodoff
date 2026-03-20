<script setup lang="ts">
defineProps<{
  variant?: "primary" | "surface" | "danger";
}>();
</script>

<template>
  <button
    class="cursor-pointer rounded-full py-2.5 text-sm transition-all duration-200 hover:scale-105 active:scale-100"
    :class="{
      'bg-lavender  font-medium text-midnight hover:bg-lavender-soft active:bg-lavender disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-lavender-dim disabled:text-cream-muted disabled:hover:scale-100':
        variant === 'primary',
      'bg-lavender/50 font-light text-cream-muted hover:bg-lavender hover:text-midnight active:bg-lavender-soft':
        !variant || variant === 'surface',
      'bg-surface font-light text-cream-muted hover:bg-cancel hover:text-midnight active:bg-cancel-hover':
        variant === 'danger',
    }"
  >
    <slot />
  </button>
</template>
