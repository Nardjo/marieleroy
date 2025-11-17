export const useAnalytics = () => {
  const route = useRoute()

  const trackCTAClick = (ctaName: string, properties: Record<string, any> = {}) => {
    const { $clientPosthog } = useNuxtApp()

    if (!$clientPosthog) {
      console.warn('analytics - $clientPosthog not available')
      return
    }

    const eventData = {
      cta_name: ctaName,
      page: route.path,
      timestamp: new Date().toISOString(),
      ...properties,
    }

    ;($clientPosthog as any).capture('cta_clicked', eventData)
  }

  const trackPageView = (pageName: string = 'homepage', properties: Record<string, any> = {}) => {
    const { $clientPosthog } = useNuxtApp()

    if (!$clientPosthog) {
      console.warn('analytics - $clientPosthog not available')
      return
    }

    const eventData = {
      page_name: pageName,
      page: route.path,
      timestamp: new Date().toISOString(),
      ...properties,
    }

    ;($clientPosthog as any).capture('page_view', eventData)
  }

  return {
    trackCTAClick,
    trackPageView,
  }
}
