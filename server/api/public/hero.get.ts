export default defineEventHandler(async () => {
  const hero = await prisma.heroSection.findFirst({
    select: {
      subtitle: true,
      description: true,
      videoUrl: true,
      posterUrl: true,
      avatars: true,
      clientsText: true,
      additionalClientsCount: true,
    },
  })

  if (!hero) {
    return {
      subtitle: 'Copywriter Professionnelle',
      description: 'Des mots qui convertissent, des messages qui résonnent.',
      videoUrl: null,
      posterUrl: null,
      avatars: [],
      clientsText: 'clients satisfaits',
      additionalClientsCount: 0,
    }
  }

  return hero
})
