export const useCostOfInaction = () => {
  const loading = ref(false)

  const fetchCostOfInaction = async () => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/cost-of-inaction')
      return response
    } finally {
      loading.value = false
    }
  }

  const updateCostOfInaction = async (data: {
    badgeText?: string
    title?: string
    subtitle?: string | null
    painPoints?: string[]
    warningTitle?: string | null
    warningSubtitle?: string | null
    solutionText1?: string | null
    solutionText2?: string | null
    solutionHighlight?: string | null
    ctaTitle?: string | null
    ctaDescription?: string | null
    ctaButtonText?: string | null
  }) => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/cost-of-inaction', {
        method: 'PUT',
        body: data,
      })
      return response
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    fetchCostOfInaction,
    updateCostOfInaction,
  }
}
