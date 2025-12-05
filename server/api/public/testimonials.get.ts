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
      ctaUseEmail: true,
      ctaEmailSubject: true,
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

  // Récupérer les settings pour le lien CTA par défaut et l'email
  const settingsRaw = await prisma.siteSetting.findMany({
    where: { key: { in: ['cta_link', 'email'] } },
    select: { key: true, value: true },
  })
  const settingsMap = Object.fromEntries(settingsRaw.map(s => [s.key, s.value]))

  const defaultCtaLink = settingsMap.cta_link || '#'
  const contactEmail = settingsMap.email || ''

  // Construire le lien CTA final
  const buildCtaLink = () => {
    if (header?.ctaUseEmail && contactEmail) {
      const subject = header.ctaEmailSubject || ''
      const encodedSubject = encodeURIComponent(subject)
      return `mailto:${contactEmail}${subject ? `?subject=${encodedSubject}` : ''}`
    }
    if (header?.ctaUseDefaultUrl !== false) {
      return defaultCtaLink
    }
    return header?.ctaButtonUrl || defaultCtaLink
  }

  const defaultHeader = {
    title: 'Ce que disent mes clients,',
    subtitle: 'leurs résultats',
    description: 'Découvrez comment j\'ai aidé mes clients à transformer leurs idées en contenus percutants',
    ctaTitle: 'Tu veux faire passer ton business au niveau supérieur ?',
    ctaDescription: 'Parle-moi de ton projet et on voit ensemble comment augmenter tes conversions sans t\'épuiser.',
    ctaButtonText: 'Réserve ton appel offert',
    ctaLink: defaultCtaLink,
  }

  return {
    header: header ? {
      title: header.title,
      subtitle: header.subtitle,
      description: header.description,
      ctaTitle: header.ctaTitle,
      ctaDescription: header.ctaDescription,
      ctaButtonText: header.ctaButtonText,
      ctaLink: buildCtaLink(),
    } : defaultHeader,
    testimonials: testimonials || [],
  }
})
