export default defineEventHandler(async () => {
  // Récupérer le header
  const header = await prisma.faqHeader.findFirst({
    select: {
      title: true,
      subtitle: true,
      description: true,
    },
  })

  // Récupérer les questions FAQ
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

  return {
    header: header || {
      title: 'Vos questions,',
      subtitle: 'mes réponses',
      description: 'Retrouvez les réponses aux questions les plus courantes sur mes services de copywriting',
    },
    items: faqItems || [],
  }
})
