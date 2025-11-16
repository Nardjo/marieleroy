import { z } from 'zod'
import { cleanOptionalField } from '../../utils/validation'

const updateSchema = z.object({
  desktopImage: z.string().nullable().optional(),
  mobileImage: z.string().nullable().optional(),
})

export default defineEventHandler(async event => {
  const rawBody = await readBody(event)

  const body = {
    desktopImage: cleanOptionalField(rawBody.desktopImage),
    mobileImage: cleanOptionalField(rawBody.mobileImage),
  }

  const validated = updateSchema.parse(body)

  const separator = await prisma.imageSeparator.findFirst()

  if (!separator) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Image separator not found',
    })
  }

  const updated = await prisma.imageSeparator.update({
    where: { id: separator.id },
    data: validated,
    select: {
      id: true,
      desktopImage: true,
      mobileImage: true,
      updatedAt: true,
    },
  })

  return updated
})
