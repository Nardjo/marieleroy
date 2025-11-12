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
  console.log('Received body:', JSON.stringify(body, null, 2))

  const validation = testimonialUpdateSchema.safeParse(body)
  console.log('Validation result:', validation.success, validation.success ? validation.data : validation.error)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  // Only pass validated fields to Prisma (strips any extra properties)
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

  console.log('updateData to Prisma:', JSON.stringify(updateData, null, 2))
  console.log('All keys in updateData:', Object.keys(updateData))

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    })

    return testimonial
  } catch (error: any) {
    console.error('Error updating testimonial:', error)

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
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
