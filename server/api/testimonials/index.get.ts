import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { displayOrder: 'asc' },
    })
    return testimonials
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch testimonials',
    })
  }
})
