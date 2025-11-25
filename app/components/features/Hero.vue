<template>
  <section id="hero" class="relative overflow-hidden">
    <div class="hero-section bg-gradient-to-br from-primary-300 via-primary-200 to-amber-800/50 backdrop-blur-sm">
      <div class="container mx-auto pt-16 md:pt-24">
        <div class="space-y-4">
          <!-- Video -->
          <div class="max-w-7xl mx-auto px-4 md:px-0">
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
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </div>
          </div>

          <!-- Hero content -->
          <UPageHero
            orientation="vertical"
            :ui="{
              base: 'py-0',
              wrapper: '!py-0',
              container: '!gap-2',
              title: '!-mt-20',
            }">
            <template #title>
              <div class="flex flex-col items-center">
                <UCard class="mb-10 md:mb-20 !bg-orange-600/10">
                  <div class="tiptap-content text-orange-600/80 text-3xl md:text-5xl italic font-light" v-html="description" />
                </UCard>
                <Logo :size="100" class="scale-50 sm:scale-75 md:scale-100" />
                <h2 class="text-4xl md:text-6xl font-light text-primary-800 font-dancing-script">{{ subtitle }}</h2>
              </div>
            </template>

            <template #description>
              <!-- Avatars clients -->
              <div class="mt-10">
                <AvatarGroup :avatars :clients-text :additional-clients-count />
              </div>
            </template>

            <template #links>
              <CTAButton
                variant="outline"
                size="xl"
                icon="i-lucide-arrow-down"
                text="Témoignages"
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
  const additionalClientsCount = computed(() => hero.value?.additionalClientsCount || 0)
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
