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
  useHead({
    title: 'Accueil',
  })

  const { trackPageView } = useAnalytics()
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl

  // Structured data for SEO (Schema.org JSON-LD)
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Marie Leroy',
          description: 'Copywriter professionnelle spécialisée dans la création de contenus qui convertissent',
          url: siteUrl,
          image: `${siteUrl}/og-image.jpg`,
          priceRange: '$$',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'FR',
          },
          areaServed: {
            '@type': 'Country',
            name: 'France',
          },
          serviceType: 'Copywriting',
          provider: {
            '@type': 'Person',
            name: 'Marie Leroy',
            jobTitle: 'Copywriter Professionnelle',
          },
        }),
      },
    ],
  })

  onMounted(() => {
    trackPageView('homepage', {
      source: 'direct',
    })
  })
</script>
