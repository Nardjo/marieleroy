import { prisma } from '../../utils/prisma'

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)

    // Update or create each social link
    const updates = await Promise.all(
      Object.entries(body).map(([platform, url]) =>
        prisma.socialLink.upsert({
          where: { platform },
          update: { url: url as string | null },
          create: {
            platform,
            url: url as string | null,
          },
        }),
      ),
    )

    // Return as platform-url object
    const socialLinks = await prisma.socialLink.findMany()
    return socialLinks.reduce(
      (acc, link) => {
        acc[link.platform] = link.url
        return acc
      },
      {} as Record<string, string | null>,
    )
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update social links',
    })
  }
})
