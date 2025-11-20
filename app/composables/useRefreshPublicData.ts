/**
 * Utility to refresh all public data caches
 * Call this after any admin content update to ensure the public site shows updated data
 */
export const useRefreshPublicData = () => {
  const refreshAll = async () => {
    await Promise.all([
      refreshNuxtData('public-hero'),
      refreshNuxtData('public-about'),
      refreshNuxtData('public-method'),
      refreshNuxtData('public-faq'),
      refreshNuxtData('public-testimonials'),
      refreshNuxtData('public-image-separator'),
      refreshNuxtData('public-settings'),
      refreshNuxtData('public-seo'),
    ])
  }

  const refreshHero = () => refreshNuxtData('public-hero')
  const refreshAbout = () => refreshNuxtData('public-about')
  const refreshMethod = () => refreshNuxtData('public-method')
  const refreshFaq = () => refreshNuxtData('public-faq')
  const refreshTestimonials = () => refreshNuxtData('public-testimonials')
  const refreshImageSeparator = () => refreshNuxtData('public-image-separator')
  const refreshSettings = () => refreshNuxtData('public-settings')
  const refreshSeo = () => refreshNuxtData('public-seo')

  return {
    refreshAll,
    refreshHero,
    refreshAbout,
    refreshMethod,
    refreshFaq,
    refreshTestimonials,
    refreshImageSeparator,
    refreshSettings,
    refreshSeo,
  }
}
