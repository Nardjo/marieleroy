import { promises as fs } from 'fs'
import { join } from 'path'
import formidable from 'formidable'

const getUploadDir = (): string => {
  return process.env.UPLOAD_DIR || join(process.cwd(), 'uploads')
}

export default defineEventHandler(async event => {
  const uploadDir = getUploadDir()
  const videosDir = join(uploadDir, 'videos')

  // S'assurer que le répertoire existe
  await fs.mkdir(videosDir, { recursive: true })

  const form = formidable({
    uploadDir: videosDir,
    keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    filter: ({ mimetype }) => {
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
      return mimetype ? allowedTypes.includes(mimetype) : false
    },
  })

  try {
    const [, files] = await form.parse(event.node.req)

    const videoFiles = files.video
    if (!videoFiles || videoFiles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Aucune vidéo fournie',
      })
    }

    const file = videoFiles[0]

    // Renommer le fichier avec un timestamp
    const timestamp = Date.now()
    const newFilename = `${timestamp}-${file.originalFilename || 'video.mp4'}`
    const newPath = join(videosDir, newFilename)

    await fs.rename(file.filepath, newPath)

    return {
      url: `/uploads/videos/${newFilename}`,
      filename: `videos/${newFilename}`,
      success: true,
    }
  } catch (error: any) {
    console.error('Erreur video.post:', error)

    if (error.statusCode) {
      throw error
    }

    // Erreur formidable pour fichier trop gros
    if (error.code === 'LIMIT_FILE_SIZE' || error.message?.includes('maxFileSize')) {
      throw createError({
        statusCode: 413,
        statusMessage: 'Fichier trop volumineux. Maximum 500MB.',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de l'upload de la vidéo: ${error.message || String(error)}`,
    })
  }
})
