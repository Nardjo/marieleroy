import { createError, defineEventHandler, getRouterParam, send, setResponseHeader } from 'h3'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'

// Résout le dossier d'uploads en absolu (dev: <repo>/uploads, prod: /app/uploads)
const BASE_UPLOAD_DIR = process.env.UPLOAD_DIR ? resolve(process.env.UPLOAD_DIR) : resolve(process.cwd(), 'uploads')

console.log('📁 Upload route initialized - BASE_UPLOAD_DIR:', BASE_UPLOAD_DIR)

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
  console.log('🖼️  Upload route called - path:', path)

  if (!path) {
    console.error('❌ No path provided')
    throw createError({ statusCode: 400, statusMessage: 'Chemin de fichier invalide' })
  }

  // Protection contre path traversal
  if (path.includes('..') || path.startsWith('/')) {
    console.error('❌ Invalid path (traversal attempt):', path)
    throw createError({ statusCode: 400, statusMessage: 'Chemin de fichier invalide' })
  }

  const filePath = join(BASE_UPLOAD_DIR, path)
  console.log('📂 Full file path:', filePath)

  try {
    const buffer = await readFile(filePath)
    const mime = MIME_MAP[extname(filePath).toLowerCase()] || 'application/octet-stream'

    console.log('✅ File found, serving with MIME:', mime)

    setResponseHeader(event, 'Content-Type', mime)
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

    return send(event, buffer)
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      console.error('❌ File not found:', filePath)
      throw createError({ statusCode: 404, statusMessage: 'Fichier introuvable' })
    }
    console.error('❌ Error reading file:', err)
    throw createError({ statusCode: 500, statusMessage: "Erreur lors de la lecture du fichier" })
  }
})
