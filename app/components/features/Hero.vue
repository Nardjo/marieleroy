<script setup lang="ts">
  const { animatedCurvePath } = useCurvedAnimation()
  const { scrollToSection } = useSmoothScroll()
  const { sanitize } = useSanitize()
  const { fixPunctuation } = useTypography()

  // Fetch hero data
  const { data: hero } = await usePublicHero()

  const subtitle = computed(() => fixPunctuation(hero.value?.subtitle || 'Copywriter Professionnelle'))
  const eyebrow = computed(() =>
    sanitize(hero.value?.eyebrow || 'Des mots qui convertissent, des messages qui résonnent.'),
  )
  const bigPromise = computed(() => sanitize(hero.value?.bigPromise || ''))
  const videoUrl = computed(() => hero.value?.videoUrl || null)
  const posterUrl = computed(() => hero.value?.posterUrl || undefined)
  const avatars = computed(() => hero.value?.avatars || [])
  const clientsText = computed(() => hero.value?.clientsText || 'clients satisfaits')
  const additionalClientsCount = computed(() => hero.value?.additionalClientsCount || 0)
  const ctaButtonText = computed(() => hero.value?.ctaButtonText || 'On discute ?')
  const ctaLink = computed(() => hero.value?.ctaLink || '#')
</script>

<template>
  <section id="hero" class="relative overflow-hidden pt-14 lg:pt-16">
    <!-- Mesh gradient + Glassmorphism -->
    <div class="mesh-gradient"></div>
    <div class="glass-overlay"></div>
    <div class="hero-section">
      <div class="container mx-auto pt-2 md:pt-4">
        <div>

          <!-- Video -->
          <div class="max-w-5xl mx-auto px-4 md:px-0 mt-10">
            <!-- Eyebrow - au dessus de la vidéo -->
            <div
              v-if="eyebrow"
              class="text-center tiptap-content text-3xl md:text-5xl italic  bg-linear-to-r from-primary-600 to-orange-600 bg-clip-text text-transparent px-4 mb-20"
              v-html="eyebrow" />
            <div
              v-if="videoUrl"
              class="video-container w-full aspect-video rounded-lg border border-black overflow-hidden shadow-xl bg-black">
              <video
                :src="videoUrl"
                :poster="posterUrl"
                controls
                preload="metadata"
                class="w-full h-full object-cover"
                aria-label="Vidéo de présentation de Marie Leroy, copywriter professionnelle"
                title="Vidéo de présentation">
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </div>
          </div>

          <!-- Big Promise - en dessous de la vidéo -->
          <div
            v-if="bigPromise"
            class="text-center tiptap-content text-2xl mt-20 md:text-4xl font-semibold text-primary-700 max-w-3xl mx-auto px-4"
            v-html="bigPromise" />

          <!-- Hero content -->
          <UPageHero
            orientation="vertical"
            :ui="{
              wrapper: '!py-0 -mt-10 md:-mt-16',
              container: '!gap-2',
              title: '!mt-5',
            }">
            <template #title>
              <div class="flex flex-col items-center">
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
                :text="ctaButtonText"
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

<style scoped>
  .mesh-gradient {
    position: absolute;
    inset: 0;
    background-color: #fef3c7;
    background-image:
      radial-gradient(at 20% 20%, #fde68a 0px, transparent 50%),
      radial-gradient(at 80% 10%, #bfdbfe 0px, transparent 50%),
      radial-gradient(at 60% 60%, #fed7aa 0px, transparent 50%),
      radial-gradient(at 10% 80%, #c7d2fe 0px, transparent 50%),
      radial-gradient(at 90% 70%, #fef08a 0px, transparent 50%);
  }

  .glass-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .hero-section {
    position: relative;
    z-index: 2;
    padding-bottom: 4rem;
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
