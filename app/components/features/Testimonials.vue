<script setup lang="ts">
  const { sanitize } = useSanitize()
  const { fixPunctuation } = useTypography()

  // Fetch testimonials from API
  const { data: testimonialsData } = await usePublicTestimonials()

  const header = computed(() => {
    const h = testimonialsData.value?.header || {
      title: 'Ce que disent mes clients,',
      subtitle: 'leurs résultats',
      description: "Découvrez comment j'ai aidé mes clients à transformer leurs idées en contenus percutants",
    }
    return {
      ...h,
      title: fixPunctuation(h.title),
      subtitle: fixPunctuation(h.subtitle),
      description: sanitize(h.description),
    }
  })
  const testimonials = computed(() => testimonialsData.value?.testimonials || [])

  // CTA
  const ctaTitle = computed(() => header.value?.ctaTitle || 'Tu veux faire passer ton business au niveau supérieur ?')
  const ctaDescription = computed(() => header.value?.ctaDescription || 'Parle-moi de ton projet et on voit ensemble comment augmenter tes conversions sans t\'épuiser.')
  const ctaButtonText = computed(() => header.value?.ctaButtonText || 'Réserve ton appel offert')
  const ctaLink = computed(() => header.value?.ctaLink || '#')
</script>

<template>
  <section id="testimonials" class="py-16 bg-white">
    <div class="container mx-auto px-4 max-w-6xl">
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-12">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-4">
          <Icon name="i-lucide-quote" class="w-4 h-4" />
          Témoignages
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
          {{ header.title }}
          <span v-if="header.subtitle" class="text-primary-700">{{ header.subtitle }}</span>
        </h2>
        <div
          v-if="header.description"
          class="tiptap-content text-xl md:text-2xl italic font-semibold text-orange-600/80 font-sans max-w-2xl mx-auto"
          v-html="header.description" />
      </div>

      <!-- Liste des témoignages vidéo -->
      <div class="space-y-8 max-w-5xl mx-auto">
        <UCard
          v-for="(testimonial, index) in testimonials"
          :key="index"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 200 } }"
          class="overflow-hidden shadow-xl !bg-primary-200">
          <!-- Vidéo en haut -->
          <div class="mb-6">
            <YouTubeEmbed :embed-url="testimonial.embedUrl" :title="testimonial.title" />
          </div>

          <!-- Titre et citation en dessous (centrés) -->
          <div class="text-center px-2">
            <h3 class="text-4xl md:text-5xl font-bold text-primary-900 mb-6 md:mb-8">
              {{ testimonial.title }}
            </h3>
            <p
              v-if="testimonial.subtitle"
              class="text-xl md:text-3xl font-extralight italic text-orange-600/80 mb-4 md:mb-10 font-sans">
              {{ testimonial.subtitle }}
            </p>
            <p
              class="text-xl md:text-2xl text-primary-700 italic leading-relaxed"
              :class="{ 'mt-4': !testimonial.subtitle }">
              "{{ testimonial.quote }}"
            </p>
          </div>
        </UCard>
      </div>

      <!-- CTA Section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="mt-12">
        <CTASection
          :title="ctaTitle"
          :description="ctaDescription"
          :button-text="ctaButtonText"
          :button-to="ctaLink"
          :button-external="true"
          icon="i-lucide-rocket"
          card-bg-class="!bg-primary-200"
          tracking-name="start_project_cta"
          tracking-section="testimonials" />
      </div>
    </div>
  </section>
</template>
