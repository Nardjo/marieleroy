import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    let header = await prisma.faqHeader.findFirst()

    // Si aucun header n'existe, en créer un par défaut
    if (!header) {
      header = await prisma.faqHeader.create({
        data: {
          title: 'Vos questions,',
          subtitle: 'mes réponses',
          description: 'Retrouvez les réponses aux questions les plus courantes sur mes services de copywriting',
        },
      })
    }

    return header
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch FAQ header',
    })
  }
})
