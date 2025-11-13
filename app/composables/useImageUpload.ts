export const useImageUpload = () => {
  const uploadImage = async (file: File, endpoint = '/api/upload/image') => {
    const formData = new FormData()
    formData.append('image', file)

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
    uploadImage,
  }
}
