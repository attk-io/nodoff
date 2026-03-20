<script setup lang="ts">
defineProps<{
  variant?: "primary" | "surface" | "danger";
}>();
</script>

<template>
  <button
    class="cursor-pointer rounded-full py-2.5 text-sm transition-all duration-200 hover:scale-105 active:scale-100"
    :class="{
      'bg-violet-9  font-medium text-mauve-1 hover:bg-violet-10 active:bg-violet-9 disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-violet-7 disabled:text-mauve-11 disabled:hover:scale-100':
        variant === 'primary',
      'bg-violet-4 font-light text-mauve-11 hover:bg-violet-9 hover:text-mauve-1 active:bg-violet-10':
        !variant || variant === 'surface',
      'bg-mauve-3 font-light text-mauve-11 hover:bg-tomato-9 hover:text-mauve-1 active:bg-tomato-10':
        variant === 'danger',
    }"
  >
    <slot />
  </button>
</template>
