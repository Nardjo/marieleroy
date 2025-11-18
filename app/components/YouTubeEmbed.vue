<template>
  <div class="lazy-youtube-container aspect-video rounded-lg overflow-hidden relative bg-gray-900">
    <!-- Placeholder avec thumbnail YouTube -->
    <div v-if="!isLoaded" class="relative w-full h-full cursor-pointer group" @click="loadVideo">
      <!-- Thumbnail YouTube (image de prévisualisation) -->
      <img
        :src="thumbnailUrl"
        :alt="`Vidéo YouTube: ${title}`"
        class="w-full h-full object-cover"
        loading="lazy" />

      <!-- Overlay avec bouton play -->
      <div
        class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div
          class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
          <UIcon name="i-lucide-play" class="w-10 h-10 text-white ml-1" />
        </div>
      </div>

      <!-- Indication "Cliquez pour charger" -->
      <div class="absolute bottom-4 left-4 right-4 text-white text-sm font-medium drop-shadow-lg">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-youtube" class="w-5 h-5" />
          <span>Cliquez pour charger la vidéo</span>
        </div>
      </div>
    </div>

    <!-- iFrame YouTube (chargé à la demande) -->
    <iframe
      v-if="isLoaded"
      :src="embedUrlWithAutoplay"
      class="w-full h-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    embedUrl: string
    title?: string
  }>()

  const isLoaded = ref(false)

  // Extraire l'ID de la vidéo YouTube depuis l'URL
  const videoId = computed(() => {
    if (!props.embedUrl) return null

    // Support pour différents formats YouTube
    let match = props.embedUrl.match(/youtube\.com\/embed\/([^?]+)/)
    if (!match) {
      match = props.embedUrl.match(/youtu\.be\/([^?]+)/)
    }
    if (!match) {
      match = props.embedUrl.match(/youtube\.com\/watch\?v=([^&]+)/)
    }
    if (!match) {
      match = props.embedUrl.match(/youtube-nocookie\.com\/embed\/([^?]+)/)
    }

    return match ? match[1] : null
  })

  // URL de la thumbnail YouTube (hqdefault = 480x360, toujours disponible)
  const thumbnailUrl = computed(() => {
    if (!videoId.value) return ''
    return `https://img.youtube.com/vi/${videoId.value}/hqdefault.jpg`
  })

  // Ajouter autoplay=1 quand on charge la vidéo (meilleure UX)
  const embedUrlWithAutoplay = computed(() => {
    if (!props.embedUrl) return ''
    const separator = props.embedUrl.includes('?') ? '&' : '?'
    return `${props.embedUrl}${separator}autoplay=1`
  })

  // Charger la vidéo au clic
  const loadVideo = () => {
    isLoaded.value = true
  }

  // Optionnel: Pré-charger automatiquement quand visible (Intersection Observer)
  const container = ref<HTMLElement>()
  const shouldAutoLoad = ref(false) // Peut être activé via prop si besoin

  onMounted(() => {
    if (!shouldAutoLoad.value || !container.value) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded.value) {
            loadVideo()
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Commencer à charger 50px avant d'être visible
      }
    )

    observer.observe(container.value)
  })
</script>

<style scoped>
  .lazy-youtube-container {
    position: relative;
  }
</style>
