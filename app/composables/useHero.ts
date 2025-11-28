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

  const updateHero = async (data: {
    subtitle: string
    description: string
    videoUrl?: string | null
    posterUrl?: string | null
    avatars?: Array<{
      firstName: string
      lastName: string
      subtitle: string
      imageUrl: string
    }>
  }) => {
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
