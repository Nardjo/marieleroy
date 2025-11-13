import { prisma } from '../../utils/prisma'
import { testimonialCreateSchema } from '../../utils/validation'

export default defineEventHandler(async event => {
  // TODO: Add authentication check

  const body = await readBody(event)

  const validation = testimonialCreateSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        ...validation.data,
        displayOrder: validation.data.displayOrder ?? 0,
      },
    })

    return testimonial
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create testimonial',
    })
  }
})
