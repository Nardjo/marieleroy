<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  defineProps<{
    items: NavigationMenuItem[]
  }>()

  const currentYear = new Date().getFullYear()
  const { scrollToSection } = useSmoothScroll()

  const scrollToTop = () => {
    scrollToSection('hero', 0)
  }
</script>

<template>
  <footer class="bg-primary-100 py-12 border-t">
    <UContainer class="max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
        <div>
          <h3 class="font-semibold text-gray-800 mb-4">Navigation</h3>
          <ul class="space-y-2">
            <li v-for="link in items" :key="link.label">
              <button class="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer" @click="link.onClick">
                {{ link.label }}
              </button>
            </li>
            <li>
              <NuxtLink to="/" class="text-gray-600 hover:text-gray-800 transition-colors">Portfolio</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="flex flex-col items-center">
          <h3 class="font-semibold text-gray-800 mb-4">Contact</h3>
          <div class="flex gap-4">
            <UButton
              icon="i-lucide-instagram"
              color="neutral"
              variant="ghost"
              size="xl"
              to="https://www.instagram.com/mari.eleroy94/"
              target="_blank"
              aria-label="Instagram"
              class="text-gray-600 hover:text-gray-800" />
            <UButton
              icon="i-lucide-mail"
              color="neutral"
              variant="ghost"
              size="xl"
              to="mailto:contact@marieleroy.fr"
              aria-label="Email"
              class="text-gray-600 hover:text-gray-800" />
          </div>
        </div>

        <div class="flex flex-col items-center md:items-start gap-4">
          <UButton
            class="hover:-translate-y-1 transition-transform cursor-pointer"
            variant="subtle"
            color="primary"
            icon="i-lucide-move-up"
            size="lg"
            aria-label="Remonter en haut de la page"
            @click="scrollToTop" />
          <Logo :size="100" class="scale-50 sm:scale-75 md:scale-100 -mt-10" />
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-200/30 text-center">
        <p class="text-sm text-gray-600">
          © {{ currentYear }} Marie Leroy. Tous droits réservés. Site réalisé par
          <ULink
            to="https://www.jordanbastin.fr"
            target="_blank"
            class="underline hover:text-gray-800 transition-colors">
            Jordan Bastin
          </ULink>
        </p>
      </div>
    </UContainer>
  </footer>
</template>
