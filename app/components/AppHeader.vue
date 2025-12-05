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
  const navLinkDefaultClasses =
    'text-gray-700 hover:text-primary-600 hover:bg-primary-500/10'
  const navLinkActiveClasses =
    'text-primary-600 bg-primary-500/10 font-medium'

  // Helpers
  const isActiveLink = (sectionId: string) => {
    // Pour le moment, on ne gère pas l'état actif basé sur la section visible
    return false
  }

  const getNavLinkClasses = (sectionId: string) => [
    navLinkBaseClasses,
    isActiveLink(sectionId) ? navLinkActiveClasses : navLinkDefaultClasses,
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

  const handleNavClick = (item: { onClick?: () => void }) => {
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
    <!-- Pas de fond en mode normal - le header est transparent et suit le fond du hero -->

    <!-- Container pour le contenu centré en mode normal -->
    <div class="header-container" :class="{ 'is-scrolled': isScrolled }">
      <div class="header-wrapper" :class="{ 'is-scrolled': isScrolled }">
        <!-- Pill background (mode scrollé) -->
        <div
          class="header-bg absolute inset-0 rounded-full backdrop-blur-xl border transition-all duration-500 bg-white/90 border-primary-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.02)]"
          :class="isScrolled ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2.5'" />

        <!-- Content -->
        <div class="header-content">
          <!-- Logo -->
          <button
            class="header-logo text-primary-800 hover:text-primary-600 transition-all cursor-pointer shrink-0"
            @click="scrollToSection('hero')">
            <Logo :size="28" compact class="header-logo-icon" />
          </button>

          <!-- Navigation - Desktop -->
          <nav class="hidden lg:flex items-center gap-1">
            <button
              v-for="item in items"
              :key="item.label"
              :class="['nav-link text-base cursor-pointer', ...getNavLinkClasses(item.label)]"
              @click="handleNavClick(item)">
              {{ item.label }}
            </button>
          </nav>

          <!-- Actions - Desktop -->
          <div class="hidden lg:flex items-center gap-2">
            <!-- CTA Button -->
            <UButton
              :to="ctaLink"
              target="_blank"
              color="primary"
              variant="solid"
              size="lg"
              class="header-cta rounded-full text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg">
              Me contacter
            </UButton>
          </div>

          <!-- Mobile Actions -->
          <div class="lg:hidden flex items-center gap-1">
            <!-- Burger Button -->
            <button
              class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-500/10 transition-colors"
              aria-label="Menu"
              @click="toggleMobileMenu">
              <UIcon
                :name="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
                class="w-5 h-5 text-gray-700" />
            </button>
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
    <button
      class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Fermer le menu"
      @click="closeMobileMenu">
      <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-700" />
    </button>

    <!-- Logo -->
    <div class="mb-8">
      <button
        class="flex items-center gap-3 text-xl font-bold text-gray-900 cursor-pointer"
        @click="handleNavClick({ onClick: () => scrollToSection('hero') })">
        <Logo :size="26" compact />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-1">
      <button
        v-for="item in items"
        :key="item.label"
        :class="['flex items-center gap-3 px-4 py-4 text-lg rounded-xl cursor-pointer text-left', ...getNavLinkClasses(item.label)]"
        @click="handleNavClick(item)">
        {{ item.label }}
      </button>
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

<style scoped>
  /* Container qui centre le contenu */
  .header-container {
    position: relative;
    max-width: 80rem;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    transition:
      padding 500ms cubic-bezier(0.4, 0, 0.2, 1),
      max-width 500ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-container.is-scrolled {
    max-width: 52rem;
    padding: 0.75rem 1rem;
  }

  /* Wrapper qui contient le fond pill */
  .header-wrapper {
    position: relative;
    padding: 0.5rem 0.5rem;
    transition: padding 500ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-wrapper.is-scrolled {
    padding: 0.75rem 1.25rem;
  }

  /* Content */
  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 0 0.5rem;
    transition:
      gap 500ms cubic-bezier(0.4, 0, 0.2, 1),
      padding 500ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-wrapper.is-scrolled .header-content {
    gap: 1.5rem;
    padding: 0 0.75rem;
  }

  /* Logo */
  .header-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.25rem;
    white-space: nowrap;
    transition:
      font-size 500ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 500ms cubic-bezier(0.4, 0, 0.2, 1),
      gap 500ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .header-logo-icon {
    transition:
      transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-wrapper.is-scrolled .header-logo {
    font-size: 1rem;
    gap: 0.5rem;
  }

  .header-wrapper.is-scrolled .header-logo-icon {
    transform: scale(0.85);
  }

  /* Navigation links */
  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9375rem;
    border-radius: 9999px;
    transition:
      color 200ms ease,
      background-color 200ms ease,
      padding 500ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-wrapper.is-scrolled .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  /* CTA Button */
  .header-cta {
    transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .header-wrapper.is-scrolled .header-cta {
    transform: scale(0.9);
  }
</style>
