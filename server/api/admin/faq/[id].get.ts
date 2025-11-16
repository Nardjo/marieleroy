import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'FAQ ID is required',
    })
  }

  try {
    const faq = await prisma.faq.findUnique({
      where: { id },
    })

    if (!faq) {
      throw createError({
        statusCode: 404,
        statusMessage: 'FAQ not found',
      })
    }

    return faq
  } catch {
    if (error.statusCode === 404) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch FAQ',
    })
  }
})
