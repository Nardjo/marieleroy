<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  defineProps<{
    items: NavigationMenuItem[]
  }>()

  const { scrollToSection } = useSmoothScroll()
</script>

<template>
  <UHeader
    mode="slideover"
    class="drop-shadow-xl backdrop-blur-lg border bg-primary-300/80 border-primary-200/30 px-4 py-2 md:px-3 md:py-1 lg:px-6"
    :toggle="{
      color: 'neutral',
      variant: 'ghost',
      size: 'xl',
      icon: 'i-heroicons-bars-3',
    }">
    <template #title>
      <button
        class="flex items-center justify-center cursor-pointer transition-colors hover:text-primary"
        @click="scrollToSection('hero', 0)">
        <Logo :size="32" :minimal="true" :compact="true" />
      </button>
    </template>

    <UNavigationMenu :items="items" variant="link"  color="primary" />


    <template #body>
      <UNavigationMenu :items="items" variant="link" orientation="vertical" color="primary" />
    </template>



    <template #right>
      <div class="flex items-center gap-3">
        <UButton
          label="Me contacter"
          size="xl"
          class="rounded-full !px-4 hidden lg:flex bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg transition-all"
          to="/" />
      </div>
    </template>
  </UHeader>
</template>
