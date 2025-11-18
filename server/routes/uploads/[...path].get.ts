import { createError, defineEventHandler, getRouterParam, send, setResponseHeader } from 'h3'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'

// Résout le dossier d'uploads en absolu (dev: <repo>/uploads, prod: /app/uploads)
const BASE_UPLOAD_DIR = process.env.UPLOAD_DIR ? resolve(process.env.UPLOAD_DIR) : resolve(process.cwd(), 'uploads')

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
}

export default defineEventHandler(async event => {
  const path = getRouterParam(event, 'path')

  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Chemin de fichier invalide' })
  }

  // Protection contre path traversal
  if (path.includes('..') || path.startsWith('/')) {
    throw createError({ statusCode: 400, statusMessage: 'Chemin de fichier invalide' })
  }

  const filePath = join(BASE_UPLOAD_DIR, path)

  try {
    const buffer = await readFile(filePath)
    const mime = MIME_MAP[extname(filePath).toLowerCase()] || 'application/octet-stream'

    setResponseHeader(event, 'Content-Type', mime)
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

    return send(event, buffer)
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      throw createError({ statusCode: 404, statusMessage: 'Fichier introuvable' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la lecture du fichier' })
  }
})
