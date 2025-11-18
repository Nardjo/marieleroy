import { prisma } from '../../../utils/prisma'
import { seoSettingsSchema } from '../../../utils/validation'

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)

    // Validate the request body
    const validation = seoSettingsSchema.safeParse(body)

    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid SEO settings data',
        data: validation.error.errors,
      })
    }

    // Upsert the singleton SEO settings record
    const seoSettings = await prisma.sEOSettings.upsert({
      where: { id: 'default' },
      update: validation.data,
      create: {
        id: 'default',
        ...validation.data,
      },
    })

    return seoSettings
  } catch (error: any) {
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update SEO settings',
    })
  }
})
