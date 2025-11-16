import { prisma } from '../../../utils/prisma'
import { aboutSectionSchema, cleanOptionalField } from '../../../utils/validation'

export default defineEventHandler(async event => {
  // TODO: Add authentication check

  const rawBody = await readBody(event)

  const body = {
    title: rawBody.title,
    description: rawBody.description,
    subtitle: cleanOptionalField(rawBody.subtitle),
    imageUrl: cleanOptionalField(rawBody.imageUrl),
  }

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
      where: { id: 'default' },
      update: validation.data,
      create: { id: 'default', ...validation.data },
    })

    return aboutSection
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update about section',
    })
  }
})
