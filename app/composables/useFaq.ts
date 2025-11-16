export const useFaq = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Récupérer toutes les questions
  const fetchFaqs = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/admin/faq')
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des questions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer une question par ID
  const fetchFaq = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`/api/admin/faq/${id}`)
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la question'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Créer une question
  const createFaq = async (faq: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/admin/faq', {
        method: 'POST',
        body: faq,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la question'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour une question
  const updateFaq = async (id: string, faq: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`/api/admin/faq/${id}`, {
        method: 'PUT',
        body: faq,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la question'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Supprimer une question
  const deleteFaq = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/admin/faq/${id}`, {
        method: 'DELETE',
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la question'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchFaqs,
    fetchFaq,
    createFaq,
    updateFaq,
    deleteFaq,
  }
}
