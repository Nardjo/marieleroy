import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)

    // Update or create each setting
    const updates = await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: value as string | null },
          create: {
            key,
            value: value as string | null,
            type: 'string',
          },
        }),
      ),
    )

    // Return as key-value object
    const settings = await prisma.siteSetting.findMany()
    return settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, string | null>,
    )
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update site settings',
    })
  }
})
