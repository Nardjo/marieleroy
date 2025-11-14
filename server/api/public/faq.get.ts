export default defineEventHandler(async () => {
  const faqItems = await prisma.faq.findMany({
    select: {
      id: true,
      question: true,
      answer: true,
      displayOrder: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  })

  return faqItems || []
})
