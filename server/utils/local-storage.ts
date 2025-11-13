import { createError } from 'h3'
import { promises as fs, createWriteStream } from 'fs'
import { join } from 'path'
import type { Readable } from 'stream'
import { pipeline } from 'stream/promises'

const getUploadDir = (): string => {
  return process.env.UPLOAD_DIR || '/app/uploads'
}

/**
 * Assure que le répertoire parent existe
 */
const ensureDirectory = async (filePath: string) => {
  const dir = filePath.substring(0, filePath.lastIndexOf('/'))
  await fs.mkdir(dir, { recursive: true })
}

/**
 * Upload un fichier vers le stockage local
 */
export const uploadToLocal = async (key: string, stream: Readable, contentType?: string, size?: number) => {
  try {
    const uploadDir = getUploadDir()
    const filePath = join(uploadDir, key)

    // Assurer que le répertoire existe
    await ensureDirectory(filePath)

    // Écrire le fichier
    await pipeline(stream, createWriteStream(filePath))

    return {
      key,
      url: `/uploads/${key}`,
      size,
      contentType,
    }
  } catch (error: any) {
    console.error("Erreur lors de l'upload local:", error)
    throw createError({
      statusCode: 500,
      statusMessage: `Impossible d'uploader le fichier (${error.message})`,
    })
  }
}

/**
 * Récupère la clé (chemin relatif) depuis une URL publique
 */
export const getLocalKeyFromUrl = (url: string | null | undefined): string | null => {
  if (!url) {
    return null
  }

  // Si c'est un chemin relatif (commence par /uploads/), extraire directement la clé
  if (url.startsWith('/uploads/')) {
    return url.slice('/uploads/'.length)
  }

  return null
}
