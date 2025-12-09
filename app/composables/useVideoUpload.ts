export const useVideoUpload = () => {
  const isUploading = ref(false)

  const uploadVideo = async (file: File, endpoint = '/api/upload/video') => {
    const formData = new FormData()
    formData.append('video', file)

    isUploading.value = true

    try {
      const data = await $fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      return data
    } catch (error: any) {
      const message = error.data?.message || error.message || "Erreur lors de l'upload"
      throw new Error(message)
    } finally {
      isUploading.value = false
    }
  }

  return {
    isUploading,
    uploadVideo,
  }
}
