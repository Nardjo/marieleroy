import { prisma } from '../../utils/prisma'

export default defineEventHandler(async event => {
  // TODO: Add authentication check

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'FAQ ID is required',
    })
  }

  try {
    await prisma.faq.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete FAQ',
    })
  }
})
