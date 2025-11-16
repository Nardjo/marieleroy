import { prisma } from '../../../../utils/prisma'
import { methodStepSchema } from '../../../../utils/validation'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const validation = methodStepSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  try {
    const step = await prisma.methodStep.create({
      data: validation.data,
    })

    return step
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create method step',
    })
  }
})
