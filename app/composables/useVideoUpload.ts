export const useVideoUpload = () => {
  const uploadVideo = async (file: File, endpoint = '/api/upload/video') => {
    const formData = new FormData()
    formData.append('video', file)

    try {
      const data = await $fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      return data
    } catch (error: any) {
      const message = error.data?.message || error.message || "Erreur lors de l'upload"
      throw new Error(message)
    }
  }

  return {
    uploadVideo,
  }
}
