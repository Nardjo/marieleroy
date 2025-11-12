import { prisma } from '../../utils/prisma'
import { aboutSectionSchema } from '../../utils/validation'

export default defineEventHandler(async event => {
  // TODO: Add authentication check

  const body = await readBody(event)

  const validation = aboutSectionSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  try {
    const aboutSection = await prisma.aboutSection.upsert({
      where: { id: 'default' }, // Assuming single about section
      update: validation.data,
      create: { id: 'default', ...validation.data },
    })

    return aboutSection
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update about section',
    })
  }
})
