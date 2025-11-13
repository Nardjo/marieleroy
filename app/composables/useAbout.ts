export const useAbout = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAbout = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/about')
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la section'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAbout = async (about: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/about', {
        method: 'PUT',
        body: about,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchAbout,
    updateAbout,
  }
}
