export const useImageUpload = () => {
  const isUploading = ref(false)

  const uploadImage = async (file: File, endpoint = '/api/upload/image') => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      isUploading.value = true
      const data = await $fetch<{ url: string; filename: string; success: boolean }>(endpoint, {
        method: 'POST',
        body: formData,
      })

      return data.url
    } catch (error: any) {
      const message = error.data?.message || error.message || "Erreur lors de l'upload"
      throw new Error(message)
    } finally {
      isUploading.value = false
    }
  }

  return {
    isUploading,
    uploadImage,
  }
}
