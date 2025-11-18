import sharp from 'sharp'

interface OptimizeImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
}

/**
 * Optimise une image en la redimensionnant et en la compressant
 * @param buffer - Buffer de l'image source
 * @param options - Options d'optimisation
 * @returns Buffer de l'image optimisée
 */
export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeImageOptions = {},
): Promise<{ buffer: Buffer; format: string }> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 80, format = 'webp' } = options

  let pipeline = sharp(buffer)

  // Redimensionner si l'image est trop grande
  pipeline = pipeline.resize(maxWidth, maxHeight, {
    fit: 'inside',
    withoutEnlargement: true,
  })

  // Convertir au format spécifié avec compression
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality })
  } else if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true })
  } else if (format === 'png') {
    pipeline = pipeline.png({ quality, compressionLevel: 9 })
  }

  const optimizedBuffer = await pipeline.toBuffer()

  return {
    buffer: optimizedBuffer,
    format,
  }
}

/**
 * Crée plusieurs versions d'une image (desktop, mobile, thumbnail)
 * @param buffer - Buffer de l'image source
 * @returns Objet contenant les différentes versions
 */
export async function createImageVariants(buffer: Buffer): Promise<{
  desktop: Buffer
  mobile: Buffer
  thumbnail: Buffer
}> {
  const [desktop, mobile, thumbnail] = await Promise.all([
    // Version desktop : max 1920x1080, WebP 80%
    optimizeImage(buffer, { maxWidth: 1920, maxHeight: 1080, quality: 80, format: 'webp' }),

    // Version mobile : max 768x768, WebP 75%
    optimizeImage(buffer, { maxWidth: 768, maxHeight: 768, quality: 75, format: 'webp' }),

    // Version thumbnail : max 400x400, WebP 70%
    optimizeImage(buffer, { maxWidth: 400, maxHeight: 400, quality: 70, format: 'webp' }),
  ])

  return {
    desktop: desktop.buffer,
    mobile: mobile.buffer,
    thumbnail: thumbnail.buffer,
  }
}
