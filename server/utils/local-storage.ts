import { createError } from 'h3'
import { promises as fs, createWriteStream } from 'fs'
import { join } from 'path'
import type { Readable } from 'stream'
import { pipeline } from 'stream/promises'

const getUploadDir = (): string => {
  return process.env.UPLOAD_DIR || join(process.cwd(), 'uploads')
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
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: `Impossible d'uploader le fichier`,
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

  // Si c'est une URL complète, extraire la partie après /uploads/
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    if (pathname.includes('/uploads/')) {
      const uploadsIndex = pathname.indexOf('/uploads/')
      return pathname.slice(uploadsIndex + '/uploads/'.length)
    }
  } catch {
    // Si ce n'est pas une URL valide, continuer
  }

  return null
}

/**
 * Supprime un fichier du système local
 */
export const deleteFromLocal = async (key: string): Promise<void> => {
  const uploadDir = getUploadDir()
  const filePath = join(uploadDir, key)

  try {
    await fs.unlink(filePath)
  } catch (error) {
    // Si le fichier n'existe pas, on ignore l'erreur
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Erreur lors de la suppression locale:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Impossible de supprimer le fichier`,
      })
    }
  }
}
