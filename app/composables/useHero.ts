export const useHero = () => {
  const loading = ref(false)

  const fetchHero = async () => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/hero')
      return response
    } finally {
      loading.value = false
    }
  }

  const updateHero = async (data: { subtitle: string; description: string; videoUrl?: string | null }) => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/hero', {
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
    fetchHero,
    updateHero,
  }
}
