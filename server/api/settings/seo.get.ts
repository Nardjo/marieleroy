import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Get the singleton SEO settings record
    const seoSettings = await prisma.sEOSettings.findFirst()

    return seoSettings
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch SEO settings',
    })
  }
})
