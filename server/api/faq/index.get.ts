import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { displayOrder: 'asc' },
    })
    return faqs
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch FAQs',
    })
  }
})
