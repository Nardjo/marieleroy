<script setup lang="ts">
  import '~/assets/css/vitrine.css'

  const { items } = useNavigation()
  const { scrollToSection } = useSmoothScroll()
  const currentYear = new Date().getFullYear()
  const scrollToTop = () => {
    scrollToSection('hero', 0)
  }
  const colorMode = useColorMode()

  // Set theme attribute on html element to prevent flicker
  useHead({
    htmlAttrs: {
      'data-theme': 'vitrine',
    },
  })

  const showHeader = ref(true)
  const lastScrollY = ref(0)
  const scrollThreshold = 5 // Pixels à scroller avant de déclencher le changement
  let ticking = false

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const scrollDifference = Math.abs(currentScrollY - lastScrollY.value)

        // Ne rien faire si le scroll est trop petit
        if (scrollDifference < scrollThreshold) {
          ticking = false
          return
        }

        // Toujours afficher le header si on est proche du haut de la page
        // On utilise la hauteur du hero (environ 400-500px) comme seuil
        if (currentScrollY < 400) {
          showHeader.value = true
        } else if (currentScrollY > lastScrollY.value && currentScrollY > 400) {
          // Scroll vers le bas - cacher le header (seulement si on a dépassé le hero)
          showHeader.value = false
        } else if (currentScrollY < lastScrollY.value) {
          // Scroll vers le haut - afficher le header
          showHeader.value = true
        }

        lastScrollY.value = currentScrollY
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    colorMode.preference = 'light'
    document.documentElement.classList.remove('dark')
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<template>
  <div class="min-h-screen flex flex-col bg-primary-100/20 overflow-hidden">
    <UHeader
      class="fixed w-full z-50 backdrop-blur-lg border bg-primary-300 border-primary-200/30 md:px-3 md:py-1 lg:px-3 transition-all duration-500"
      :style="{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)', opacity: showHeader ? 1 : 0 }"
      mode="slideover">
      <template #left>
        <NuxtLink
          class="flex items-center gap-2 hover:text-primary-500 text-xl transition-all duration-200 cursor-pointer"
          @click="scrollToSection('hero')">
          <Logo :size="32" :minimal="true" :compact="true" />
        </NuxtLink>
      </template>

      <UNavigationMenu :items="items" class="hidden lg:flex" />

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

    <UMain class="flex-1 pt-16">
      <slot />
    </UMain>

    <footer class="bg-primary-100 py-12 border-t">
      <UContainer class="max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
          <div>
            <h3 class="font-semibold text-gray-800 mb-4">Navigation</h3>
            <ul class="space-y-2">
              <li v-for="link in items" :key="link.label">
                <button
                  class="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                  @click="link.onClick">
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
            <button class="cursor-pointer" size="lg" aria-label="Remonter en haut de la page" @click="scrollToTop">
              <Logo :size="100" class="scale-50 -mt-10" />
            </button>
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
  </div>
</template>
