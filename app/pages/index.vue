<script setup lang="ts">
  const { trackPageView } = useAnalytics()

  onMounted(() => {
    trackPageView('homepage', {
      source: 'direct',
    })
  })
</script>

<template>
  <div>
    <FeaturesHero />
    <LazyFeaturesTestimonials />
    <LazyImageSeparator />
    <LazyFeaturesMethod />
    <LazyFeaturesAbout />
    <LazyFeaturesFaq />
    <LazyFeaturesCostOfInaction />
  </div>
</template>
