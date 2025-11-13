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
    const step = await prisma.methodStep.findUnique({
      where: { id },
    })

    if (!step) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Step not found',
      })
    }

    return step
  } catch (error: any) {
    if (error.statusCode === 404) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch method step',
    })
  }
})
