import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const settings = await prisma.siteSetting.findMany()
    return settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, string | null>,
    )
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch site settings',
    })
  }
})
