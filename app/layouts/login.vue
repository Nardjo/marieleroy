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

// Set theme preference
colorMode.preference = 'system'

useSeoMeta({
  title: `Connexion - ${siteName.value} Administration`,
  description: `Interface de connexion pour l'administration du site ${siteName.value}`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Background Pattern -->
    <div
      class="absolute inset-0 bg-grid-primary-100 dark:bg-grid-slate-700/25 bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]" />

    <!-- Content -->
    <div class="relative z-10">
      <slot />
    </div>

    <!-- Footer -->
    <footer class="absolute bottom-0 left-0 right-0 p-6">
      <div class="text-center">
        <p class="text-sm text-primary-700 dark:text-slate-400">
          © {{ new Date().getFullYear() }} {{ siteName }} - Administration
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  .bg-grid-primary-100 {
    background-image: radial-gradient(circle, rgb(199 158 125 / 0.1) 1px, transparent 1px);
  }

  .dark .bg-grid-slate-700\/25 {
    background-image: radial-gradient(circle, rgb(51 65 85 / 0.25) 1px, transparent 1px);
  }
</style>
