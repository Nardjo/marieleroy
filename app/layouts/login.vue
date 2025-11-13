<script setup lang="ts">
import '~/assets/css/admin.css'

const colorMode = useColorMode()
const siteName = ref('Marie Leroy')

// Set theme attribute on html element
useHead({
  htmlAttrs: {
    'data-theme': 'admin',
  },
})

colorMode.preference = 'system'

useSeoMeta({
  title: computed(() => `Connexion - ${siteName.value} Administration`),
  description: computed(() => `Interface de connexion pour l'administration du site ${siteName.value}`),
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-background">
    <div class="w-full max-w-md">
      <slot />
    </div>
  </div>
</template>
