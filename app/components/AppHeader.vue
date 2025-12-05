<script setup lang="ts">
  const { items } = useNavigation()
  const { scrollToSection } = useSmoothScroll()

  // State
  const isScrolled = ref(false)
  const isMobileMenuOpen = ref(false)
  const scrollThreshold = 50

  // Fetch settings for CTA
  const { data: settings } = await usePublicSettings()
  const ctaLink = computed(() => settings.value?.site?.ctaLink || '#')

  // Classes réutilisables
  const navLinkBaseClasses = 'transition-all p-2 rounded-lg'
  const navLinkDefaultClasses = 'text-gray-700 hover:text-primary-600 hover:bg-primary-500/10'
  const navLinkActiveClasses = 'text-primary-600 bg-primary-500/10 font-medium'

  // Helpers
  const isActiveLink = (sectionId: string) => {
    // Pour le moment, on ne gère pas l'état actif basé sur la section visible
    return false
  }

  const getNavLinkClasses = (sectionId?: string) => [
    navLinkBaseClasses,
    isActiveLink(sectionId || '') ? navLinkActiveClasses : navLinkDefaultClasses,
  ]

  // Actions
  const handleScroll = () => {
    isScrolled.value = window.scrollY > scrollThreshold
  }

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNavClick = (item: any) => {
    if (item.onClick) {
      item.onClick()
    }
    closeMobileMenu()
  }

  // Lifecycle
  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-transparent">
    <!-- Container -->
    <div
      class="relative mx-auto px-6 pt-3 transition-[max-width,padding] duration-500 ease-in-out"
      :class="isScrolled ? 'max-w-[52rem] px-4' : 'max-w-[75rem]'">
      <div
        class="relative transition-[padding] duration-500 ease-in-out"
        :class="isScrolled ? 'py-3 px-5' : 'py-2 px-2'">
        <!-- Pill background (mode scrollé) -->
        <div
          class="absolute inset-0 rounded-full backdrop-blur-xl border bg-white/90 border-primary-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.02)] transition-all duration-500 ease-in-out"
          :class="isScrolled ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-100 translate-y-0'" />

        <!-- Content -->
        <div
          class="relative z-10 flex items-center justify-between transition-[gap,padding] duration-500 ease-in-out"
          :class="isScrolled ? 'gap-6 px-3' : 'gap-8 px-2'">
          <!-- Logo -->
          <UButton
            variant="ghost"
            class="shrink-0 text-primary-800 hover:text-primary-600 transition-all duration-500 ease-in-out !p-0"
            @click="scrollToSection('hero')">
            <Logo :size="isScrolled ? 28 : 40" compact class="transition-transform duration-500 ease-in-out" />
          </UButton>

          <!-- Navigation - Desktop -->
          <nav class="hidden lg:flex items-center gap-1">
            <UButton
              v-for="item in items"
              :key="item.label"
              variant="ghost"
              class="rounded-full whitespace-nowrap cursor-pointer transition-all duration-500 ease-in-out"
              :class="[
                isScrolled ? 'py-1.5 px-3 text-sm' : 'py-2 px-4 text-[0.9375rem]',
                ...getNavLinkClasses(item.label),
              ]"
              @click="handleNavClick(item)">
              {{ item.label }}
            </UButton>
          </nav>

          <!-- Actions - Desktop -->
          <div class="hidden lg:flex items-center gap-2 shrink-0">
            <UButton
              :to="ctaLink"
              target="_blank"
              color="primary"
              variant="solid"
              size="lg"
              class="rounded-full text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg whitespace-nowrap transition-transform duration-500 ease-in-out"
              :class="isScrolled ? 'scale-90' : 'scale-100'">
              Me contacter
            </UButton>
          </div>

          <!-- Mobile Actions -->
          <div class="lg:hidden flex items-center gap-1">
            <UButton
              variant="ghost"
              class="w-10 h-10 rounded-full hover:bg-primary-500/10"
              aria-label="Menu"
              @click="toggleMobileMenu">
              <UIcon :name="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="w-5 h-5 text-gray-700" />
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Menu Panel (Slide from right) -->
  <div
    class="fixed inset-0 z-50 flex flex-col bg-white p-6 transition-transform duration-400 lg:hidden"
    :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'">
    <!-- Close button -->
    <UButton
      variant="ghost"
      class="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100"
      aria-label="Fermer le menu"
      @click="closeMobileMenu">
      <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-700" />
    </UButton>

    <!-- Logo -->
    <div class="mb-8">
      <UButton
        class="flex items-center gap-3 text-xl font-bold text-gray-900 cursor-pointer"
        @click="handleNavClick({ onClick: () => scrollToSection('hero') })">
        <Logo :size="26" compact />
      </UButton>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-1">
      <UButton
        v-for="item in items"
        :key="item.label"
        variant="link"
        :class="[
          ...getNavLinkClasses(item.label),
        ]"
        @click="handleNavClick(item)">
        {{ item.label }}
      </UButton>
    </nav>

    <!-- Actions - Mobile -->
    <div class="mt-auto pt-8 flex justify-center">
      <!-- CTA Button -->
      <UButton
        :to="ctaLink"
        target="_blank"
        color="primary"
        variant="solid"
        size="xl"
        class="w-3/4 rounded-full justify-center bg-gradient-to-r from-primary-600 to-primary-700"
        @click="closeMobileMenu">
        Me contacter
      </UButton>
    </div>
  </div>
</template>
