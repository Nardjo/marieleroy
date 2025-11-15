<template>
  <section id="method" ref="sectionRef" class="py-16 bg-primary-200">
    <div class="container mx-auto px-4 max-w-4xl">
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-16">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-4">
          <Icon name="i-lucide-workflow" class="w-4 h-4" />
          Ma Méthode
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
          {{ headerTitle }},
          <span class="text-primary-600">{{ headerSubtitle }}</span>
        </h2>
        <p v-if="headerDescription" class="text-primary-700 max-w-2xl mx-auto">
          {{ headerDescription }}
        </p>
      </div>

      <!-- Timeline verticale -->
      <div class="relative">
        <!-- Ligne verticale -->
        <div class="absolute left-8 top-0 bottom-0 w-1 bg-primary-300">
          <!-- Ligne de progression -->
          <div
            class="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-600 to-primary-800 transition-all duration-500 ease-out"
            :style="{ height: lineProgress }"></div>
        </div>

        <!-- Étapes -->
        <div class="space-y-12">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="relative pl-20 transition-all duration-500"
            :class="{
              'opacity-100 translate-x-0': index <= activeStep,
              'opacity-0 translate-x-8': index > activeStep,
            }">
            <!-- Point sur la ligne -->
            <div
              class="absolute left-4 top-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-lg"
              :class="[
                index <= activeStep
                  ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white scale-110'
                  : 'bg-white text-primary-400 scale-100',
              ]">
              <Icon v-if="index < activeStep" name="i-lucide-check" class="w-4 h-4" />
              <span v-else>{{ index + 1 }}</span>
            </div>

            <!-- Card de l'étape -->
            <UCard class="shadow-lg bg-primary-100">
              <div class="p-6">
                <h3 class="text-xl font-bold text-primary-900 mb-3">
                  {{ step.title }}
                </h3>
                <p class="text-primary-700 leading-relaxed">
                  {{ step.text }}
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="mt-16">
        <CTASection
          title="Prêt à transformer votre contenu ?"
          description="Découvrez comment ma méthode peut vous aider à atteindre vos objectifs de conversion et d'engagement."
          button-text="Démarrer mon projet"
          :button-to="ctaLink"
          :button-external="true"
          icon="i-lucide-rocket"
          @cta-click="console.log('CTA clicked')" />
      </div>
    </div>
  </section>
</template>

<script setup>
  const activeStep = ref(0)
  const sectionRef = ref(null)

  // Fetch method data
  const { data: methodData } = await usePublicMethod()
  const { data: settings } = await usePublicSettings()

  const header = computed(() => methodData.value?.header || {})
  const headerTitle = computed(() => header.value.title || 'Comment je travaille')
  const headerSubtitle = computed(() => header.value.subtitle || 'étape par étape')
  const headerDescription = computed(
    () =>
      header.value.description ||
      'Un processus éprouvé pour créer des contenus qui captivent et convertissent votre audience',
  )

  const steps = computed(() => {
    const dbSteps = methodData.value?.steps || []
    return dbSteps.map(step => ({
      id: step.id,
      title: step.title,
      text: step.description,
    }))
  })

  const ctaLink = computed(() => settings.value?.site?.ctaLink || '#')

  const lineProgress = computed(() => {
    const stepsLength = steps.value.length
    if (stepsLength === 0) return '0%'
    const progress = (activeStep.value / (stepsLength - 1)) * 100
    return `${progress}%`
  })

  // Détection du scroll pour faire apparaître les étapes progressivement
  onMounted(() => {
    const handleScroll = () => {
      if (!sectionRef.value) return

      const section = sectionRef.value
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculer la progression dans la section
      // La section commence à apparaître quand son top est à 80% de la hauteur de l'écran
      // Elle termine quand son bottom est à 20% de la hauteur de l'écran
      const sectionStart = rect.top - windowHeight * 0.8
      const sectionEnd = rect.bottom - windowHeight * 0.2
      const sectionHeight = sectionEnd - sectionStart

      // Position actuelle dans la section (de 0 à 1)
      let progress = 0
      if (sectionStart < 0 && sectionEnd > 0) {
        progress = Math.abs(sectionStart) / sectionHeight
        progress = Math.max(0, Math.min(1, progress))
      } else if (sectionEnd < 0) {
        progress = 1
      }

      // Déterminer l'étape active en fonction de la progression
      // Utiliser une courbe très accélérée pour faire apparaître toutes les étapes rapidement
      const acceleratedProgress = Math.pow(progress, 0.5)
      const stepsLength = steps.value.length
      const newStep = Math.min(Math.floor(acceleratedProgress * stepsLength), stepsLength - 1)

      if (newStep !== activeStep.value) {
        activeStep.value = newStep
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Appel initial

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
  })
</script>
