export const useSettings = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Récupérer les paramètres du site
  const fetchSettings = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/settings')
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des paramètres'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour les paramètres du site
  const updateSettings = async (settings: Record<string, string | null>) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/settings', {
        method: 'PUT',
        body: settings,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour des paramètres'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les liens sociaux
  const fetchSocialLinks = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/settings/social')
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des réseaux sociaux'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour les liens sociaux
  const updateSocialLinks = async (links: Record<string, string | null>) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/settings/social', {
        method: 'PUT',
        body: links,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour des réseaux sociaux'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchSettings,
    updateSettings,
    fetchSocialLinks,
    updateSocialLinks,
  }
}
