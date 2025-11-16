import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const socialLinks = await prisma.socialLink.findMany()
    return socialLinks.reduce(
      (acc, link) => {
        acc[link.platform] = link.url
        return acc
      },
      {} as Record<string, string | null>,
    )
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch social links',
    })
  }
})
