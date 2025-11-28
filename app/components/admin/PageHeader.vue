<script setup lang="ts">
  defineProps<{
    title: string
    description?: string
  }>()
</script>

<template>
  <div>
    <!-- Desktop: Title and Actions on same line -->
    <div class="hidden md:flex items-start justify-between gap-6 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ title }}</h1>
        <p v-if="description" class="text-gray-600 dark:text-gray-400 mt-2">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex gap-3 flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <!-- Mobile: Title and Description separate from actions -->
    <div class="md:hidden">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ title }}</h1>
        <p v-if="description" class="text-gray-600 dark:text-gray-400 mt-2">{{ description }}</p>
      </div>
    </div>

    <!-- Mobile Sticky Actions -->
    <div v-if="$slots.actions" class="fixed bottom-0 left-0 right-0 bg-card border-t border-default p-4 md:hidden z-40">
      <div class="flex gap-3 justify-end">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
