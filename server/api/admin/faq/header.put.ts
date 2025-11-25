import { prisma } from '../../../utils/prisma'
import { faqHeaderSchema } from '../../../utils/validation'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const validation = faqHeaderSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  try {
    // Récupérer l'header existant ou en créer un
    const existing = await prisma.faqHeader.findFirst()

    if (existing) {
      return await prisma.faqHeader.update({
        where: { id: existing.id },
        data: validation.data,
      })
    } else {
      return await prisma.faqHeader.create({
        data: validation.data,
      })
    }
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update FAQ header',
    })
  }
})
