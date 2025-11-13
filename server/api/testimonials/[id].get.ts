import { prisma } from '../../utils/prisma'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Testimonial ID is required',
    })
  }

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Testimonial not found',
      })
    }

    return testimonial
  } catch {
    if (error.statusCode === 404) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch testimonial',
    })
  }
})
