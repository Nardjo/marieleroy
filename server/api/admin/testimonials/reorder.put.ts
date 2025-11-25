import { prisma } from '../../../utils/prisma'
import { z } from 'zod'

const reorderSchema = z.object({
  testimonials: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int().min(1),
    }),
  ),
})

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const validation = reorderSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  try {
    // Utiliser une transaction pour mettre à jour tous les ordres
    const updates = validation.data.testimonials.map(testimonial =>
      prisma.testimonial.update({
        where: { id: testimonial.id },
        data: { displayOrder: testimonial.displayOrder },
      }),
    )

    await prisma.$transaction(updates)

    return { success: true }
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reorder testimonials',
    })
  }
})
