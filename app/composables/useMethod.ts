export const useMethod = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Header operations
  const fetchHeader = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/method/header')
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de l\'en-tête'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateHeader = async (header: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/method/header', {
        method: 'PUT',
        body: header,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de l\'en-tête'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Steps operations
  const fetchSteps = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/method/steps')
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des étapes'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchStep = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`/api/method/steps/${id}`)
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de l\'étape'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createStep = async (step: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/method/steps', {
        method: 'POST',
        body: step,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de l\'étape'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStep = async (id: string, step: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`/api/method/steps/${id}`, {
        method: 'PUT',
        body: step,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de l\'étape'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteStep = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/method/steps/${id}`, {
        method: 'DELETE',
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de l\'étape'
      throw err
    } finally {
      loading.value = false
    }
  }

  const reorderSteps = async (steps: Array<{ id: string; stepOrder: number }>) => {
    loading.value = true
    error.value = null
    try {
      await $fetch('/api/method/steps/reorder', {
        method: 'PUT',
        body: { steps },
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la réorganisation des étapes'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchHeader,
    updateHeader,
    fetchSteps,
    fetchStep,
    createStep,
    updateStep,
    deleteStep,
    reorderSteps,
  }
}
