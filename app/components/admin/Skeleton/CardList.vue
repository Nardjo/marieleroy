<script setup lang="ts">
  withDefaults(
    defineProps<{
      count?: number
    }>(),
    {
      count: 3,
    },
  )
</script>

<template>
  <div class="space-y-4">
    <UCard v-for="i in count" :key="i" class="shadow-sm">
      <div class="space-y-3">
        <USkeleton class="h-6 w-3/4" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-5/6" />
        <div class="flex gap-2 pt-2">
          <USkeleton class="h-8 w-20" />
          <USkeleton class="h-8 w-20" />
        </div>
      </div>
    </UCard>
  </div>
</template>
