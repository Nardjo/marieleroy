import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    let header = await prisma.testimonialsHeader.findFirst()

    // Si aucun header n'existe, en créer un par défaut
    if (!header) {
      header = await prisma.testimonialsHeader.create({
        data: {
          title: 'Ce que disent mes clients,',
          subtitle: 'leurs résultats',
          description: 'Découvrez comment j\'ai aidé mes clients à transformer leurs idées en contenus percutants',
          ctaTitle: 'Tu veux faire passer ton business au niveau supérieur ?',
          ctaDescription: 'Parle-moi de ton projet et on voit ensemble comment augmenter tes conversions sans t\'épuiser.',
          ctaButtonText: 'Réserve ton appel offert',
        },
      })
    }

    return header
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch testimonials header',
    })
  }
})
