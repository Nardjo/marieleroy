import { prisma } from '../../../utils/prisma'
import { methodHeaderSchema } from '../../../utils/validation'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const validation = methodHeaderSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  try {
    // Récupérer l'header existant ou en créer un
    const existing = await prisma.methodHeader.findFirst()

    if (existing) {
      return await prisma.methodHeader.update({
        where: { id: existing.id },
        data: validation.data,
      })
    } else {
      return await prisma.methodHeader.create({
        data: validation.data,
      })
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update method header',
    })
  }
})
