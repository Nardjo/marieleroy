export default defineEventHandler(async () => {
  // Récupérer le header
  const header = await prisma.testimonialsHeader.findFirst({
    select: {
      title: true,
      subtitle: true,
      description: true,
      ctaTitle: true,
      ctaDescription: true,
      ctaButtonText: true,
      ctaButtonUrl: true,
      ctaUseDefaultUrl: true,
    },
  })

  // Récupérer les témoignages triés par ordre
  const testimonials = await prisma.testimonial.findMany({
    select: {
      id: true,
      title: true,
      subtitle: true,
      quote: true,
      embedUrl: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  })

  return {
    header: header || {
      title: 'Ce que disent mes clients,',
      subtitle: 'leurs résultats',
      description: 'Découvrez comment j\'ai aidé mes clients à transformer leurs idées en contenus percutants',
      ctaTitle: 'Tu veux faire passer ton business au niveau supérieur ?',
      ctaDescription: 'Parle-moi de ton projet et on voit ensemble comment augmenter tes conversions sans t\'épuiser.',
      ctaButtonText: 'Réserve ton appel offert',
      ctaButtonUrl: null,
      ctaUseDefaultUrl: true,
    },
    testimonials: testimonials || [],
  }
})
