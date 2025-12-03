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
    eyebrow?: string | null
    bigPromise?: string | null
    videoUrl?: string | null
    posterUrl?: string | null
    avatars?: Array<{
      firstName: string
      lastName: string
      subtitle: string
      imageUrl: string
    }>
    additionalClientsCount?: number
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
