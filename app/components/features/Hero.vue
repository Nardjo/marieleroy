<template>
  <section id="hero" class="relative overflow-hidden">
    <div class="hero-section bg-gradient-to-br from-primary-300 via-primary-200 to-amber-800/50 backdrop-blur-sm">
      <div class="container mx-auto pt-16 md:pt-24">
        <div class="space-y-4">
          <!-- Video or placeholder -->
          <div class="max-w-3xl mx-auto px-4 md:px-0">
            <div
              v-if="videoUrl"
              class="video-container w-full aspect-video rounded-lg border border-black overflow-hidden shadow-xl bg-black">
              <video
                :src="videoUrl"
                controls
                preload="metadata"
                class="w-full h-full object-cover"
                aria-label="Vidéo de présentation de Marie Leroy, copywriter professionnelle"
                title="Vidéo de présentation">
                <!-- TODO: Add <track> element for captions when available -->
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </div>
            <div
              v-else
              class="w-full aspect-video rounded-lg border border-black overflow-hidden shadow-xl bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
              <div class="text-center text-primary-800">
                <Icon name="i-lucide-video" class="w-16 h-16 mb-2 mx-auto opacity-50" />
                <p class="text-sm font-medium">Vidéo à venir</p>
              </div>
            </div>
          </div>

          <!-- Hero content -->
          <UPageHero
            orientation="vertical"
            :ui="{
              base: 'py-0',
              wrapper: '!py-0',
              container: '!gap-2',
            }">
            <template #title>
              <div class="flex flex-col items-center">
                <Logo :size="100" class="mb-0 scale-50 sm:scale-75 md:scale-100" />
              </div>
            </template>

            <template #description>
              <div class="flex flex-col gap-3">
                <h2 class="text-2xl md:text-3xl text-primary-800">{{ subtitle }}</h2>
                <span class="text-primary-700">{{ description }}</span>
              </div>

              <!-- Avatars clients -->
              <div class="mt-6">
                <AvatarGroup :avatars="avatars" :clients-text="clientsText" />
              </div>
            </template>

            <template #links>
              <CTAButton
                variant="outline"
                size="xl"
                icon="i-lucide-arrow-down"
                text="Témoignages"
                to="#testimonials"
                tracking-name="scroll_to_testimonials"
                tracking-section="hero"
                @click="scrollToSection('testimonials')" />
              <CTAButton
                icon="i-lucide-rocket"
                size="xl"
                text="On discute ?"
                :to="ctaLink"
                :external="true"
                tracking-name="contact_cta"
                tracking-section="hero" />
            </template>
          </UPageHero>
        </div>
      </div>
    </div>

    <!-- Curved bottom border -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg class="block w-full h-32 md:h-40" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <path :d="animatedCurvePath" fill="#FFFFFF" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
  const { animatedCurvePath } = useCurvedAnimation()
  const { scrollToSection } = useSmoothScroll()

  // Fetch hero data
  const { data: hero } = await usePublicHero()
  const { data: settings } = await usePublicSettings()

  const subtitle = computed(() => hero.value?.subtitle || 'Copywriter Professionnelle')
  const description = computed(
    () => hero.value?.description || 'Des mots qui convertissent, des messages qui résonnent.',
  )
  const videoUrl = computed(() => hero.value?.videoUrl || null)
  const avatars = computed(() => hero.value?.avatars || [])
  const clientsText = computed(() => hero.value?.clientsText || 'clients satisfaits')
  const ctaLink = computed(() => settings.value?.site?.ctaLink || '#')
</script>

<style scoped>
  .hero-section {
    position: relative;
    padding-bottom: 4rem;
    /* Espace supplémentaire sur mobile pour éloigner la courbe des boutons */
  }

  @media (min-width: 768px) {
    .hero-section {
      padding-bottom: 5rem;
    }
  }

  .video-container {
    animation: soft-glow 3s ease-in-out infinite;
  }

  @keyframes soft-glow {
    0%,
    100% {
      box-shadow:
        0 0 20px rgba(251, 191, 36, 0.3),
        0 0 40px rgba(251, 191, 36, 0.2),
        0 0 60px rgba(251, 191, 36, 0.1),
        0 10px 25px -5px rgb(0 0 0 / 0.1),
        0 8px 10px -6px rgb(0 0 0 / 0.1);
    }
    50% {
      box-shadow:
        0 0 30px rgba(251, 191, 36, 0.4),
        0 0 60px rgba(251, 191, 36, 0.3),
        0 0 90px rgba(251, 191, 36, 0.2),
        0 10px 25px -5px rgb(0 0 0 / 0.1),
        0 8px 10px -6px rgb(0 0 0 / 0.1);
    }
  }
</style>
