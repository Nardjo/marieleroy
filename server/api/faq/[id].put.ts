import { prisma } from '../../utils/prisma'
import { faqUpdateSchema } from '../../utils/validation'

export default defineEventHandler(async event => {
  // TODO: Add authentication check

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'FAQ ID is required',
    })
  }

  const body = await readBody(event)

  const validation = faqUpdateSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  try {
    const faq = await prisma.faq.update({
      where: { id },
      data: validation.data,
    })

    return faq
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update FAQ',
    })
  }
})
