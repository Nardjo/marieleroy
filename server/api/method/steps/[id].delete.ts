import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Step ID is required',
    })
  }

  try {
    await prisma.methodStep.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete method step',
    })
  }
})
