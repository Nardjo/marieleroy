import { z } from 'zod'

const testimonialSchema = z.object({
  title: z.string().min(1, 'Le nom du client est requis'),
  subtitle: z.string().optional(),
  quote: z.string().min(1, 'La citation est requise'),
  embedUrl: z.string().url("L'URL doit être valide").min(1, "L'URL de la vidéo est requise"),
  displayOrder: z.number().int().min(0).default(0),
})

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const validatedData = testimonialSchema.parse(body)

  const testimonial = await prisma.testimonial.create({
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
