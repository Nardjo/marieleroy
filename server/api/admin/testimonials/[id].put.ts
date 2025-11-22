import { z } from 'zod'

const testimonialSchema = z.object({
  title: z.string().min(1, 'Le nom du client est requis'),
  subtitle: z.string().optional(),
  quote: z.string().min(1, 'La citation est requise'),
  embedUrl: z.string().url("L'URL doit être valide").min(1, "L'URL de la vidéo est requise"),
  displayOrder: z.number().int().min(0),
})

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required',
    })
  }

  const validatedData = testimonialSchema.parse(body)

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      title: validatedData.title,
      subtitle: validatedData.subtitle,
      quote: validatedData.quote,
      embedUrl: validatedData.embedUrl,
      displayOrder: validatedData.displayOrder,
    },
  })

  return testimonial
})
