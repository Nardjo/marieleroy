<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Content -->
    <div class="lg:col-span-2 space-y-6">
      <UCard>
        <div class="space-y-4">
          <div v-for="i in fields" :key="i">
            <USkeleton class="h-4 w-24 mb-2" />
            <USkeleton class="h-10 w-full" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <UCard>
        <div class="space-y-3">
          <USkeleton class="h-5 w-32 mb-4" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
          <USkeleton class="h-4 w-4/6" />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    fields?: number
  }>(),
  {
    fields: 4,
  },
)
</script>
