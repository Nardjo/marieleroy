<template>
  <div>
    <!-- Title and Description -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ title }}</h1>
      <p v-if="description" class="text-gray-600 dark:text-gray-400 mt-2">{{ description }}</p>
    </div>

    <!-- Desktop Actions -->
    <div v-if="$slots.actions" class="hidden md:flex gap-3 mb-6">
      <slot name="actions" />
    </div>

    <!-- Mobile Sticky Actions -->
    <div v-if="$slots.actions" class="fixed bottom-0 left-0 right-0 bg-card border-t border-default p-4 md:hidden z-40">
      <div class="flex gap-3 justify-end">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    description?: string
  }>()
</script>
