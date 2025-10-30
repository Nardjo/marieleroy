<template>
  <section id="hero" class="relative overflow-hidden">
    <div class="hero-section bg-gradient-to-b from-primary-300/60 to-primary-200/80">
      <div class="container mx-auto py-16 md:py-24">
        <!-- Video placeholder -->
        <div class="max-w-3xl mx-auto">
          <div
            class="w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
            <div class="text-center text-primary-800">
              <Icon name="i-lucide-video" class="w-16 h-16 mb-2 mx-auto opacity-50" />
              <p class="text-sm font-medium">Vidéo à venir</p>
            </div>
          </div>
        </div>

        <!-- Hero content -->
        <UPageHero orientation="vertical">
          <template #title>
            <div class="flex flex-col items-center">
              <Logo :size="100" class="mb-4" />
            </div>
          </template>

          <template #description>
            <div class="flex flex-col gap-3">
              <h2 class="text-2xl md:text-3xl text-primary-800">Copywriter Professionnelle</h2>
              <span class="text-primary-400">Des mots qui convertissent, des messages qui résonnent.</span>
            </div>
          </template>

          <template #links>
            <CTAButton
              variant="outline"
              to="#testimonials"
              size="xl"
              icon="i-lucide-arrow-down"
              text="Témoignages" />
            <CTAButton icon="i-lucide-rocket" size="xl" text="On discute ?" />
          </template>
        </UPageHero>
      </div>
    </div>

    <!-- Curved bottom border -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg class="block w-full h-32 md:h-40" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <path :d="animatedCurvePath" fill="#FDFCFB" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
  const { animatedCurvePath } = useCurvedAnimation()
</script>

<style scoped>
  .hero-section {
    position: relative;
    padding-bottom: 8rem;
  }
</style>
