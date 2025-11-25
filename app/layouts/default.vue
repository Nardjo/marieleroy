<script setup lang="ts">
  import '~/assets/css/vitrine.css'

  const { items } = useNavigation()
  const { scrollToSection } = useSmoothScroll()
  const currentYear = new Date().getFullYear()
  const scrollToTop = () => {
    scrollToSection('hero', 0)
  }
  const colorMode = useColorMode()

  // Fetch settings for footer and SEO
  const { data: settings } = await usePublicSettings()
  const { data: seoSettings } = await usePublicSeo()

  const siteName = computed(() => settings.value?.site?.name || 'Marie Leroy')
  const socialLinks = computed(() => {
    const links = settings.value?.socialLinks || []
    // Filtrer pour n'afficher que les liens avec une URL valide
    return links.filter(link => link.url && link.url.trim() !== '')
  })

  const socialIconMap: Record<string, string> = {
    instagram: 'i-simple-icons-instagram',
    facebook: 'i-simple-icons-facebook',
    twitter: 'i-simple-icons-x',
    linkedin: 'i-simple-icons-linkedin',
    youtube: 'i-simple-icons-youtube',
    tiktok: 'i-simple-icons-tiktok',
  }

  const getSocialIcon = (platform: string) => {
    return socialIconMap[platform.toLowerCase()] || 'i-lucide-link'
  }
  const ctaLink = computed(() => settings.value?.site?.ctaLink || undefined)

  useHead({
    htmlAttrs: {
      'data-theme': 'vitrine',
    },
    titleTemplate: computed(() => siteName.value),
  })

  // SEO meta tags
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl

  useSeoMeta({
    description: computed(
      () =>
        seoSettings.value?.metaDescription ||
        'Des mots qui convertissent, des messages qui résonnent. Découvrez mes services de copywriting pour transformer votre contenu.',
    ),
    ogTitle: computed(() => seoSettings.value?.metaTitle || 'Marie Leroy | Copywriter Professionnelle'),
    ogDescription: computed(
      () => seoSettings.value?.metaDescription || 'Des mots qui convertissent, des messages qui résonnent.',
    ),
    ogImage: computed(() =>
      seoSettings.value?.ogImage ? `${siteUrl}${seoSettings.value.ogImage}` : `${siteUrl}/og-image.jpg`,
    ),
    ogUrl: siteUrl,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: computed(() => seoSettings.value?.metaTitle || 'Marie Leroy | Copywriter Professionnelle'),
    twitterDescription: computed(
      () => seoSettings.value?.metaDescription || 'Des mots qui convertissent, des messages qui résonnent.',
    ),
    twitterImage: computed(() =>
      seoSettings.value?.ogImage ? `${siteUrl}${seoSettings.value.ogImage}` : `${siteUrl}/og-image.jpg`,
    ),
  })

  // Structured data for SEO (Schema.org JSON-LD) - Dynamic from database
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: computed(() =>
          JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            'name': seoSettings.value?.metaTitle || 'Marie Leroy',
            'description':
              seoSettings.value?.metaDescription ||
              'Copywriter professionnelle spécialisée dans la création de contenus qui convertissent',
            'url': siteUrl,
            'image': seoSettings.value?.ogImage ? `${siteUrl}${seoSettings.value.ogImage}` : `${siteUrl}/og-image.jpg`,
            'priceRange': '$$',
            'address': {
              '@type': 'PostalAddress',
              'addressCountry': 'FR',
            },
            'areaServed': {
              '@type': 'Country',
              'name': 'France',
            },
            'serviceType': 'Copywriting',
            'provider': {
              '@type': 'Person',
              'name': siteName.value,
              'jobTitle': 'Copywriter Professionnelle',
            },
          }),
        ),
      },
    ],
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
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-primary-300/60 to-primary-200/80 overflow-hidden">
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
            :to="ctaLink || '#'"
            target="_blank" />
        </div>
      </template>
    </UHeader>

    <main class="flex-1 pt-16">
      <slot />
    </main>

    <footer class="bg-primary-100 py-8 md:py-10 border-t">
      <UContainer class="max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-center md:text-left">
          <div>
            <h3 class="font-semibold text-gray-800 mb-3 md:mb-4">Navigation</h3>
            <ul class="space-y-0">
              <li v-for="link in items" :key="link.label">
                <UButton
                  variant="link"
                  class="text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer underline underline-offset-2 hover:underline-offset-4  min-h-[40px]"
                  @click="link.onClick">
                  {{ link.label }}
                </UButton>
              </li>
              <li>
                <UButton
                  variant="link"
                  class="text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer underline underline-offset-2 hover:underline-offset-4  min-h-[40px]"
                  @click="navigateTo('/admin')">
                  Administration
                </UButton>
              </li>
            </ul>
          </div>

          <div class="flex flex-col items-center md:items-start">
            <h3 class="font-semibold text-gray-800 mb-3 md:mb-4">Réseaux Sociaux</h3>
            <div class="flex gap-4 justify-center md:justify-start">
              <UButton
                v-for="link in socialLinks"
                :key="link.platform"
                :icon="getSocialIcon(link.platform)"
                size="xl"
                :to="link.url"
                target="_blank"
                :aria-label="link.platform"
                variant="ghost"
                class="text-gray-600 hover:bg-primary-200 transition-all" />
            </div>
            <h3 class="font-semibold text-gray-800 mt-3 md:mt-8">Une question ?</h3>
            <UButton
              variant="link"
              icon="i-lucide-mail"
              class="text-lg text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer underline underline-offset-2 hover:underline-offset-4 min-h-[44px]"
              :to="`mailto:${settings?.site?.contactEmail || ''}?subject=Question pour Marie Leroy`">
              {{ settings?.site?.contactEmail || ' ' }}
            </UButton>
          </div>

          <div class="flex flex-col items-center md:items-start gap-4">
            <button class="cursor-pointer" size="lg" aria-label="Remonter en haut de la page" @click="scrollToTop">
              <Logo :size="100" class="scale-50 -mt-10" />
            </button>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200/30 text-center">
          <p class="text-sm text-gray-600">
            © {{ currentYear }} {{ siteName }}. Tous droits réservés. Site réalisé par
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
