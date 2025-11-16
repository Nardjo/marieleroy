export const useSeo = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Récupérer les paramètres SEO
  const fetchSeoSettings = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/admin/settings/seo')
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des paramètres SEO'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour les paramètres SEO
  const updateSeoSettings = async (settings: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/admin/settings/seo', {
        method: 'PUT',
        body: settings,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour des paramètres SEO'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchSeoSettings,
    updateSeoSettings,
  }
}
