interface ImageSeparatorData {
  desktopImage?: string | null
  mobileImage?: string | null
}

export const useImageSeparator = () => {
  const loading = ref(false)

  const fetchImageSeparator = async () => {
    loading.value = true
    try {
      const data = await $fetch('/api/admin/image-separator')
      return data
    } catch (error) {
      console.error('Error fetching image separator:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateImageSeparator = async (data: ImageSeparatorData) => {
    loading.value = true
    try {
      const updated = await $fetch('/api/admin/image-separator', {
        method: 'PUT',
        body: data,
      })
      return updated
    } catch (error) {
      console.error('Error updating image separator:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    fetchImageSeparator,
    updateImageSeparator,
  }
}
