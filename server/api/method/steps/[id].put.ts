import { prisma } from '../../../utils/prisma'
import { methodStepSchema } from '../../../utils/validation'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Step ID is required',
    })
  }

  const validation = methodStepSchema.partial().safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  try {
    const step = await prisma.methodStep.update({
      where: { id },
      data: validation.data,
    })

    return step
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update method step',
    })
  }
})
