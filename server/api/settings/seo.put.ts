import { prisma } from '../../utils/prisma'
import { seoSettingsSchema } from '../../utils/validation'

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)

    console.log('SEO PUT - Body received:', body)

    // Validate the request body
    const validation = seoSettingsSchema.safeParse(body)

    if (!validation.success) {
      console.log('SEO PUT - Validation errors:', validation.error.errors)
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid SEO settings data',
        data: validation.error.errors,
      })
    }

    console.log('SEO PUT - Validation passed:', validation.data)

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
