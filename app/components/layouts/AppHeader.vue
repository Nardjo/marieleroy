<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

defineProps<{
  items: NavigationMenuItem[]
}>()

const {scrollToSection} = useSmoothScroll()
</script>

<template>
  <UHeader
      class="backdrop-blur-lg border bg-primary-200 border-primary-200/30  md:px-3 md:py-1 lg:px-6"
      mode="slideover">
    <template #left>
      <NuxtLink
          class="flex items-center gap-2 hover:text-primary-500 text-xl transition-all duration-200 cursor-pointer"
          @click="scrollToSection('hero')">
        <Logo :size="32" :minimal="true" :compact="true"/>
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" class="hidden lg:flex"/>

    <template #body>
      <UNavigationMenu :items="items" variant="link" orientation="vertical" color="primary"/>
    </template>


    <template #right>
      <div class="flex items-center gap-3">
        <UButton
            label="Me contacter"
            size="xl"
            class="rounded-full !px-4 hidden lg:flex bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg transition-all"
            to="/"/>
      </div>
    </template>
  </UHeader>
</template>
