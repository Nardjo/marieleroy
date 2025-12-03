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
          ctaTitle: 'Besoin d\'un regard expert sur ton marketing ?',
          ctaDescription: 'On analyse ton copywriting ensemble et je te montre ce qui peut réellement booster tes conversions.',
          ctaButtonText: 'Obtenir un audit gratuit',
        },
      })
    }

    return header
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch method header',
    })
  }
})
