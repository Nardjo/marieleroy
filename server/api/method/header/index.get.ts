import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    let header = await prisma.methodHeader.findFirst()

    // Si aucun header n'existe, en créer un par défaut
    if (!header) {
      header = await prisma.methodHeader.create({
        data: {
          title: 'Comment je travaille',
          subtitle: 'étape par étape',
          description: 'Un processus éprouvé pour créer des contenus qui captivent et convertissent votre audience',
        },
      })
    }

    return header
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch method header',
    })
  }
})
