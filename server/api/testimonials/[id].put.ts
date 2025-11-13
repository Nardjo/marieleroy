import { prisma } from '../../utils/prisma'
import { testimonialUpdateSchema } from '../../utils/validation'

export default defineEventHandler(async event => {
  // TODO: Add authentication check

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Testimonial ID is required',
    })
  }

  const body = await readBody(event)
  const validation = testimonialUpdateSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  // Only pass validated fields to Prisma
  const updateData: {
    title?: string
    quote?: string
    embedUrl?: string
    displayOrder?: number
  } = {}

  if (validation.data.title !== undefined) updateData.title = validation.data.title
  if (validation.data.quote !== undefined) updateData.quote = validation.data.quote
  if (validation.data.embedUrl !== undefined) updateData.embedUrl = validation.data.embedUrl
  if (validation.data.displayOrder !== undefined) updateData.displayOrder = validation.data.displayOrder

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    })

    return testimonial
  } catch (error: any) {
    // Handle Prisma specific errors
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Testimonial not found',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update testimonial',
    })
  }
})
