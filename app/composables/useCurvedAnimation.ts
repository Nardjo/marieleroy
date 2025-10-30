import { computed, onMounted, onUnmounted, ref } from 'vue'

export const useCurvedAnimation = () => {
  const scrollY = ref(0)
  const screenWidth = ref(0)

  const curveProgress = computed(() => {
    const maxScroll = 500
    const progress = Math.min(scrollY.value / maxScroll, 1)
    return progress
  })

  const animatedCurvePath = computed(() => {
    const progress = curveProgress.value

    // Ajuster la courbure selon la largeur d'écran
    // Mobile: 60%, Tablette: 100%, Desktop: 150%
    const isMobile = screenWidth.value < 768
    const isTablet = screenWidth.value >= 768 && screenWidth.value < 1024
    const maxCurveHeight = isMobile ? 60 : isTablet ? 100 : 150

    const curveHeight = progress * maxCurveHeight

    const viewportWidth = 1440
    const viewportHeight = 400

    // Calculer la hauteur de la courbe en pixels
    const curveHeightPx = (viewportHeight * curveHeight) / 100

    // Créer un path qui commence en haut à gauche,
    // fait une courbe vers le bas au centre,
    // remonte à droite, puis ferme en bas
    const path = `
      M 0,0
      L 0,0
      Q ${viewportWidth / 2},${curveHeightPx} ${viewportWidth},0
      L ${viewportWidth},0
      L ${viewportWidth},${viewportHeight}
      L 0,${viewportHeight}
      Z
    `
      .trim()
      .replace(/\s+/g, ' ')

    return path
  })

  let ticking = false
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        scrollY.value = window.scrollY
        ticking = false
      })
      ticking = true
    }
  }

  const handleResize = () => {
    screenWidth.value = window.innerWidth
  }

  onMounted(() => {
    screenWidth.value = window.innerWidth
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    handleScroll() // Appel initial
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
  })

  return {
    scrollY,
    curveProgress,
    animatedCurvePath,
  }
}
