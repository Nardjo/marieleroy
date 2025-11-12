<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ title }}</h1>
      <p v-if="description" class="text-gray-600 dark:text-gray-400 mt-2">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    description?: string
  }>()
</script>
