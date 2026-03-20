<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

const emit = defineEmits<{
  reset: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center space-y-6">
    <div class="animate-fade-up text-center">
      <p
        class="font-['Fraunces'] text-xl font-light text-cream"
        style="
          font-variation-settings:
            &quot;SOFT&quot; 100,
            &quot;WONK&quot; 1;
        "
      >
        Sweet dreams
      </p>
      <p class="mt-1 text-xs font-light text-lavender-dim">
        Your timer has ended
      </p>
    </div>
    <BaseButton
      variant="primary"
      class="animate-fade-up w-full"
      style="animation-delay: 100ms"
      @click="emit('reset')"
    >
      Set New Timer
    </BaseButton>
  </div>
</template>
