<template>
  <section id="testimonials" class="py-16 bg-white">
    <div class="container mx-auto px-4 max-w-6xl">
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-4">
          <Icon name="i-lucide-quote" class="w-4 h-4" />
          Témoignages
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
          Ce que disent mes clients, <span class="text-primary-600">leurs résultats</span>
        </h2>
        <p class="text-primary-700 max-w-2xl mx-auto">
          Découvrez comment j'ai aidé mes clients à transformer leurs idées en contenus percutants
        </p>
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
          <!-- Vidéo -->
          <div class="aspect-video rounded-lg overflow-hidden mb-6">
            <iframe
              :src="testimonial.embedUrl"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>

          <!-- Contenu en dessous -->
          <div class="px-2 pb-2">
            <h3 class="text-3xl font-bold text-primary-900 mb-4">
              {{ testimonial.title }}
            </h3>
            <p class="text-lg text-primary-700 italic leading-relaxed">
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
          title="Prêt à transformer votre communication ?"
          description="Discutons ensemble de votre projet et voyons comment je peux vous aider à atteindre vos objectifs."
          button-text="Démarrer un projet"
          icon="i-lucide-rocket"
          card-bg-class="!bg-primary-200"
          @cta-click="console.log('CTA clicked')" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  // Fetch testimonials from API
  const { data: testimonialsData } = await usePublicTestimonials()

  const testimonials = computed(() => testimonialsData.value || [])
</script>
