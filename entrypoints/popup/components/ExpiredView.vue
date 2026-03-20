<script setup lang="ts">
const emit = defineEmits<{
  reset: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center space-y-4">
    <p class="text-sm font-medium text-gray-500">
      Timer expired
    </p>
    <button
      class="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
      @click="emit('reset')"
    >
      Set New Timer
    </button>
  </div>
</template>
