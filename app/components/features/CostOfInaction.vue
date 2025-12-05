<script setup lang="ts">
  const { sanitize } = useSanitize()
  const { data: sectionData } = await usePublicCostOfInaction()

  const section = computed(() => sectionData.value || {
    title: 'Ce qui te coûte le plus cher aujourd\'hui…',
    subtitle: 'ce n\'est pas ce que tu ne fais pas assez.<br /><strong class="text-orange-700">C\'est de continuer à tout faire toi-même, sans structure claire ni véritable stratégie.</strong>',
    painPoints: [
      "Créer du contenu non-stop sans vision d'ensemble.",
      "Laisser filer des ventes chaque jour faute d'un système optimisé.",
      "T'épuiser à maintenir un business qui dépend encore trop de toi.",
    ],
    warningTitle: 'Ne rien changer aujourd\'hui = accepter que ton CA plafonne encore des\u00a0mois.',
    warningSubtitle: 'Ton système actuel bride ta croissance et siphonne ton énergie.',
    solutionText1: 'Avec ma méthode, tu récupères du <strong class="text-primary-900">temps</strong>, de la <strong class="text-primary-900">clarté</strong>…',
    solutionText2: '… et tu casses enfin le plafond qui te bloque depuis trop longtemps.',
    solutionHighlight: 'Pour un business qui tourne <span class="text-orange-600">sans toi</span>, <span class="text-primary-600">pour toi</span>.',
    ctaTitle: 'Une question avant de te lancer\u00a0?',
    ctaDescription: 'N\'hésite pas à me contacter directement par mail. Je serai ravie de t\'aider !',
    ctaButtonText: 'Envoyer un message',
    ctaLink: '#',
  })

  const painPoints = computed(() => {
    const points = section.value?.painPoints
    if (Array.isArray(points)) return points
    return []
  })

  const ctaLink = computed(() => section.value?.ctaLink || '#')
</script>

<template>
  <section id="cost-of-inaction" class="py-16 bg-white">
    <div class="container mx-auto px-4 max-w-4xl">
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-20">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-4">
          <Icon name="i-lucide-alert-triangle" class="w-4 h-4" />
          Pourquoi agir ?
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
          {{ section.title }}
        </h2>
        <div
          v-if="section.subtitle"
          class="tiptap-content text-xl text-primary-700"
          v-html="sanitize(section.subtitle)" />
      </div>

      <!-- Pain Points -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
        class="space-y-8 mb-20">
        <div
          v-for="(point, index) in painPoints"
          :key="index"
          class="flex items-start gap-4 p-4 bg-white/80 backdrop-blur rounded-lg border-l-4 border-orange-500 shadow-sm">
          <Icon name="i-lucide-arrow-right" class="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
          <p class="text-lg text-primary-800 font-medium">{{ point }}</p>
        </div>
      </div>

      <!-- Warning Message -->
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :visible-once="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 400 } }"
        class="border-2 border-orange-500 rounded-xl p-6 md:p-8 text-center mb-20 shadow-lg bg-orange-50">
        <div
          v-if="section.warningTitle"
          class="tiptap-content text-xl md:text-2xl font-bold mb-2 text-primary-900"
          v-html="sanitize(section.warningTitle)" />
        <p v-if="section.warningSubtitle" class="text-lg text-primary-700">
          {{ section.warningSubtitle }}
        </p>
      </div>

      <!-- Solution -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 600 } }"
        class="text-center">
        <div
          v-if="section.solutionText1"
          class="tiptap-content text-xl md:text-2xl text-primary-800 mb-8"
          v-html="sanitize(section.solutionText1)" />
        <p v-if="section.solutionText2" class="text-xl md:text-2xl text-primary-800 mb-10">
          {{ section.solutionText2 }}
        </p>
        <div
          v-if="section.solutionHighlight"
          class="tiptap-content text-2xl md:text-3xl font-bold text-primary-900"
          v-html="sanitize(section.solutionHighlight)" />
      </div>

      <!-- CTA -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 800 } }"
        class="mt-24">
        <CTASection
          :title="section.ctaTitle || 'Une question avant de te lancer ?'"
          :description="section.ctaDescription || 'N\'hésite pas à me contacter directement par mail. Je serai ravie de t\'aider !'"
          :button-text="section.ctaButtonText || 'Envoyer un message'"
          :button-to="ctaLink"
          :button-external="true"
          icon="i-lucide-mail"
          tracking-name="cta_cost_of_inaction_email"
          tracking-section="cost-of-inaction" />
      </div>
    </div>
  </section>
</template>
