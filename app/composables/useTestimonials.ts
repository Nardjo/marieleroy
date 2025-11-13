export const useTestimonials = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Récupérer tous les témoignages
  const fetchTestimonials = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/testimonials')
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des témoignages'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer un témoignage par ID
  const fetchTestimonial = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`/api/testimonials/${id}`)
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement du témoignage'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Créer un témoignage
  const createTestimonial = async (testimonial: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/testimonials', {
        method: 'POST',
        body: testimonial,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création du témoignage'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour un témoignage
  const updateTestimonial = async (id: string, testimonial: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        body: testimonial,
      })
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du témoignage'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Supprimer un témoignage
  const deleteTestimonial = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression du témoignage'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchTestimonials,
    fetchTestimonial,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  }
}
