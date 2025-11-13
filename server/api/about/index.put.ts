import { prisma } from '../../utils/prisma'
import { aboutSectionSchema } from '../../utils/validation'

export default defineEventHandler(async event => {
  // TODO: Add authentication check

  const rawBody = await readBody(event)

  console.log('📥 RAW BODY:', JSON.stringify(rawBody, null, 2))

  // Clean empty strings, null, and whitespace-only strings to undefined for optional fields
  const cleanField = (value: any) => {
    if (value === null || value === undefined || value === '') return undefined
    if (typeof value === 'string' && value.trim() === '') return undefined
    return value
  }

  const body = {
    title: rawBody.title,
    description: rawBody.description,
    subtitle: cleanField(rawBody.subtitle),
    imageUrl: cleanField(rawBody.imageUrl),
  }

  console.log('🧹 CLEANED BODY:', JSON.stringify(body, null, 2))

  const validation = aboutSectionSchema.safeParse(body)

  if (!validation.success) {
    console.log('❌ VALIDATION ERROR:', JSON.stringify(validation.error.flatten(), null, 2))
  }

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
