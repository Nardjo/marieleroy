export default defineEventHandler(async () => {
  const hero = await prisma.heroSection.findFirst({
    select: {
      subtitle: true,
      description: true,
      videoUrl: true,
      avatars: true,
      clientsText: true,
    },
  })

  if (!hero) {
    return {
      subtitle: 'Copywriter Professionnelle',
      description: 'Des mots qui convertissent, des messages qui résonnent.',
      videoUrl: null,
      avatars: [],
      clientsText: 'clients satisfaits',
    }
  }

  return hero
})
