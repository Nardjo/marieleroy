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
    },
  })

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
      ctaButtonUrl: null,
      ctaUseDefaultUrl: true,
    }
  }

  return hero
})
