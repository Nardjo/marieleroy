<script setup lang="ts">
  const { sanitize } = useSanitize()
  const { fixPunctuation } = useTypography()
  const activeStep = ref(-1)
  const sectionRef = ref(null)
  const stepRefs = ref<HTMLElement[]>([])

  // Fetch method data
  const { data: methodData } = await usePublicMethod()

  const header = computed(() => methodData.value?.header || {})
  const headerTitle = computed(() => fixPunctuation(header.value.title || 'Comment je travaille'))
  const headerSubtitle = computed(() => fixPunctuation(header.value.subtitle || 'étape par étape'))
  const headerDescription = computed(() =>
    sanitize(
      header.value.description ||
        'Un processus éprouvé pour créer des contenus qui captivent et convertissent votre audience',
    ),
  )

  const steps = computed(() => {
    const dbSteps = methodData.value?.steps || []
    return dbSteps.map(step => ({
      id: step.id,
      title: step.title,
      text: sanitize(step.description),
    }))
  })

  // CTA
  const ctaTitle = computed(() => header.value?.ctaTitle || 'Besoin d\'un regard expert sur ton marketing ?')
  const ctaDescription = computed(() => header.value?.ctaDescription || 'On analyse ton copywriting ensemble et je te montre ce qui peut réellement booster tes conversions.')
  const ctaButtonText = computed(() => header.value?.ctaButtonText || 'Obtenir un audit gratuit')
  const ctaLink = computed(() => header.value?.ctaLink || '#')

  const lineProgress = computed(() => {
    const total = steps.value.length
    if (!total) return '0%'
    const shown = Math.max(activeStep.value + 1, 0)
    return `${(shown / total) * 100}%`
  })

  // Détection du scroll pour faire apparaître les étapes progressivement
  onMounted(() => {
    // Fallback for browsers that don't support IntersectionObserver
    if (!window.IntersectionObserver) {
      // For browsers without IntersectionObserver, we can still show all steps
      // by setting activeStep to the last step when component is mounted
      activeStep.value = steps.value.length - 1
      return
    }

    const stop = useIntersectionObserver(
      stepRefs,
      entries => {
        entries.forEach(entry => {
          const idx = Number((entry.target as HTMLElement).dataset.index)
          if (entry.isIntersecting && idx > activeStep.value) {
            activeStep.value = idx
          }
        })
        
      },
      { threshold: 0.25 },
    )

    onUnmounted(() => stop?.())
  })
</script>

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
          <span class="text-primary-700">{{ headerSubtitle }}</span>
        </h2>
        <div
          v-if="headerDescription"
          class="tiptap-content text-xl md:text-2xl italic font-semibold text-orange-600/80 font-sans max-w-2xl mx-auto"
          v-html="headerDescription" />
      </div>

      <!-- Timeline verticale -->
      <div class="relative">
        <!-- Ligne verticale -->
        <div class="absolute left-8 top-0 bottom-0 w-1 bg-primary-300">
          <!-- Ligne de progression -->
          <div
            class="absolute top-0 left-0 w-full bg-linear-to-b from-primary-600 to-primary-800 transition-all duration-500 ease-out"
            :style="{ height: lineProgress }"></div>
        </div>

        <!-- Étapes -->
        <div class="space-y-12">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            :data-index="index"
            :ref="el => el && (stepRefs[index] = el)"
            class="relative pl-20 transition-all duration-700 ease-out"
            :class="index <= activeStep ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'">
            <!-- Point sur la ligne -->
            <div
              class="absolute left-4 top-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-lg"
              :class="[
                index <= activeStep
                  ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white scale-110'
                  : 'bg-white text-primary-400 scale-100',
              ]">
              {{ index + 1 }}
            </div>

            <!-- Card de l'étape -->
            <UCard class="shadow-lg bg-primary-100">
              <div class="p-6">
                <h3 class="text-xl font-bold text-primary-900 mb-3">
                  {{ step.title }}
                </h3>
                <div class="tiptap-content text-primary-700 leading-relaxed" v-html="step.text" />
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
          :title="ctaTitle"
          :description="ctaDescription"
          :button-text="ctaButtonText"
          :button-to="ctaLink"
          :button-external="true"
          icon="i-lucide-eye"
          tracking-name="start_project_cta"
          tracking-section="method" />
      </div>
    </div>
  </section>
</template>
