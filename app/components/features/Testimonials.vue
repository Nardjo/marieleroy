<template>
  <section id="testimonials" class="py-16 bg-white">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="text-center mb-12">
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
          class="overflow-hidden shadow-xl bg-primary-100">
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
      <div class="mt-12">
        <CTASection
          title="Prêt à transformer votre communication ?"
          description="Discutons ensemble de votre projet et voyons comment je peux vous aider à atteindre vos objectifs."
          button-text="Démarrer un projet"
          icon="i-lucide-rocket"
          @cta-click="console.log('CTA clicked')" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Pour l'instant, des données statiques - vous pourrez connecter à une API plus tard
const testimonials = ref([
  {
    title: 'Marie',
    quote: 'Grâce à Marie, j\'ai pu transformer ma communication et atteindre mes objectifs de manière efficace.',
    embedUrl: 'https://www.youtube.com/embed/KJNbhiD9YLg?rel=0&modestbranding=1&showinfo=0&controls=1&fs=1',
  },
  {
    title: 'Jessica',
    quote: 'Un travail exceptionnel qui a dépassé toutes mes attentes. Ma marque a pris une toute nouvelle dimension.',
    embedUrl: 'https://www.youtube.com/embed/3enzfMLVIbo?rel=0&modestbranding=1&showinfo=0&controls=1&fs=1',
  },
  {
    title: 'Lilie',
    quote: 'Marie a su capter l\'essence de mon message et créer un contenu qui résonne vraiment avec mon audience.',
    embedUrl: 'https://www.youtube.com/embed/3Ah-CkKIKx8?rel=0&modestbranding=1&showinfo=0&controls=1&fs=1',
  },
])
</script>
