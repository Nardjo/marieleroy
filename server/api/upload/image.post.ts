import { uploadToLocal } from '../../utils/local-storage'
import { Readable } from 'stream'

export default defineEventHandler(async event => {
  try {
    const form = await readMultipartFormData(event)

    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Aucune image fournie',
      })
    }

    const file = form.find(f => f.name === 'image')

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Aucune image fournie',
      })
    }

    // Valider le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (file.type && !allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF.',
      })
    }

    // Créer un nom de fichier unique
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.filename || 'image'}`
    const key = `images/${filename}`

    // Convertir les données en stream
    const stream = Readable.from(file.data)

    // Upload le fichier
    const result = await uploadToLocal(key, stream, file.type, file.data.length)

    return {
      url: result.url,
      filename: result.key,
      success: true,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de l'upload de l'image",
    })
  }
})
