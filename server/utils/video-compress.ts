import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import { join, dirname, basename, extname } from 'path'

interface CompressOptions {
  crf?: number // Qualité (0-51, plus bas = meilleure qualité, défaut: 28)
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow'
  maxWidth?: number // Largeur max (garde le ratio)
  audioBitrate?: string // ex: '128k'
}

const defaultOptions: CompressOptions = {
  crf: 28,
  preset: 'fast',
  maxWidth: 1280,
  audioBitrate: '128k',
}

/**
 * Compresse une vidéo avec FFmpeg
 * Retourne le chemin de la vidéo compressée
 */
export const compressVideo = async (inputPath: string, options: CompressOptions = {}): Promise<string> => {
  const opts = { ...defaultOptions, ...options }
  const dir = dirname(inputPath)
  const ext = extname(inputPath)
  const name = basename(inputPath, ext)
  const outputPath = join(dir, `${name}-compressed.mp4`)

  // Construire les arguments FFmpeg
  const args = [
    '-i',
    inputPath,
    '-c:v',
    'libx264', // Codec H.264 (compatible partout)
    '-crf',
    String(opts.crf),
    '-preset',
    opts.preset!,
    '-c:a',
    'aac', // Codec audio AAC
    '-b:a',
    opts.audioBitrate!,
    '-movflags',
    '+faststart', // Optimise pour le streaming web
    '-vf',
    `scale='min(${opts.maxWidth},iw)':-2`, // Redimensionne si > maxWidth, garde le ratio
    '-y', // Écrase si existe
    outputPath,
  ]

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args)

    let stderr = ''

    ffmpeg.stderr.on('data', data => {
      stderr += data.toString()
    })

    ffmpeg.on('close', async code => {
      if (code === 0) {
        // Supprimer l'original et renommer le compressé
        try {
          await fs.unlink(inputPath)
          const finalPath = join(dir, `${name}.mp4`)
          await fs.rename(outputPath, finalPath)
          resolve(finalPath)
        } catch (err) {
          // Si le renommage échoue, garder le fichier compressé
          resolve(outputPath)
        }
      } else {
        reject(new Error(`FFmpeg error (code ${code}): ${stderr.slice(-500)}`))
      }
    })

    ffmpeg.on('error', err => {
      reject(new Error(`FFmpeg spawn error: ${err.message}`))
    })
  })
}

/**
 * Vérifie si FFmpeg est disponible
 */
export const isFFmpegAvailable = async (): Promise<boolean> => {
  return new Promise(resolve => {
    const ffmpeg = spawn('ffmpeg', ['-version'])
    ffmpeg.on('close', code => resolve(code === 0))
    ffmpeg.on('error', () => resolve(false))
  })
}
