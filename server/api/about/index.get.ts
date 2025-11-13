import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const aboutSection = await prisma.aboutSection.findFirst()

    if (!aboutSection) {
      throw createError({
        statusCode: 404,
        statusMessage: 'About section not found',
      })
    }

    return aboutSection
  } catch (error: any) {
    if (error.statusCode === 404) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch about section',
    })
  }
})
