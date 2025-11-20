<template>
  <div>
    <FeaturesHero />
    <FeaturesTestimonials />
    <ImageSeparator />
    <FeaturesMethod />
    <FeaturesAbout />
    <FeaturesFaq />
  </div>
</template>

<script setup lang="ts">
 const { trackPageView } = useAnalytics()

  onMounted(() => {
    trackPageView('homepage', {
      source: 'direct',
    })
  })
</script>
