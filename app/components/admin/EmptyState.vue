<template>
  <UCard class="shadow-sm">
    <div class="text-center py-12">
      <UIcon :name="icon" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ description }}</p>
      <UButton v-if="buttonLabel" color="primary" :icon="buttonIcon" @click="$emit('action')">
        {{ buttonLabel }}
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
  defineProps<{
    icon: string
    title: string
    description: string
    buttonLabel?: string
    buttonIcon?: string
  }>()

  defineEmits<{
    action: []
  }>()
</script>
