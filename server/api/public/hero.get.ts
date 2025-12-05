export default defineEventHandler(async () => {
  const hero = await prisma.heroSection.findFirst({
    select: {
      subtitle: true,
      eyebrow: true,
      bigPromise: true,
      videoUrl: true,
      posterUrl: true,
      avatars: true,
      clientsText: true,
      additionalClientsCount: true,
      ctaButtonText: true,
      ctaButtonUrl: true,
      ctaUseDefaultUrl: true,
      ctaUseEmail: true,
      ctaEmailSubject: true,
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
    if (hero?.ctaUseEmail && contactEmail) {
      const subject = hero.ctaEmailSubject || ''
      const encodedSubject = encodeURIComponent(subject)
      return `mailto:${contactEmail}${subject ? `?subject=${encodedSubject}` : ''}`
    }
    if (hero?.ctaUseDefaultUrl !== false) {
      return defaultCtaLink
    }
    return hero?.ctaButtonUrl || defaultCtaLink
  }

  if (!hero) {
    return {
      subtitle: 'Copywriter Professionnelle',
      eyebrow: 'Des mots qui convertissent, des messages qui résonnent.',
      bigPromise: null,
      videoUrl: null,
      posterUrl: null,
      avatars: [],
      clientsText: 'clients satisfaits',
      additionalClientsCount: 0,
      ctaButtonText: 'On discute ?',
      ctaLink: defaultCtaLink,
    }
  }

  return {
    subtitle: hero.subtitle,
    eyebrow: hero.eyebrow,
    bigPromise: hero.bigPromise,
    videoUrl: hero.videoUrl,
    posterUrl: hero.posterUrl,
    avatars: hero.avatars,
    clientsText: hero.clientsText,
    additionalClientsCount: hero.additionalClientsCount,
    ctaButtonText: hero.ctaButtonText,
    ctaLink: buildCtaLink(),
  }
})
