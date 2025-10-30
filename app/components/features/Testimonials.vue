<template>
  <section id="testimonials" class="py-16 overflow-x-hidden">
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

      <FocusCard :cards="focusCardItems" />

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
import { computed } from 'vue'

// Pour l'instant, des données statiques - vous pourrez connecter à une API plus tard
const testimonials = ref([
  {
    title: 'Client 1',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    title: 'Client 2',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    title: 'Client 3',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
])

const focusCardItems = computed(() => {
  return (testimonials.value ?? []).map((t: any) => {
    let id = ''

    if (t.videoUrl.includes('watch?v=')) {
      id = t.videoUrl.split('watch?v=')[1].split('&')[0]
    } else if (t.videoUrl.includes('/embed/')) {
      id = t.videoUrl.split('/embed/')[1]
    } else {
      id = t.videoUrl.split('/').at(-1)
    }

    return {
      title: t.title,
      imageUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      videoUrl: t.videoUrl.includes('/embed/') ? t.videoUrl : `https://www.youtube.com/embed/${id}`,
    }
  })
})
</script>
