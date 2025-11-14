export default defineEventHandler(async () => {
  const hero = await prisma.heroSection.findFirst({
    select: {
      subtitle: true,
      description: true,
      videoUrl: true,
    },
  })

  return hero || {
    subtitle: 'Copywriter Professionnelle',
    description: 'Des mots qui convertissent, des messages qui résonnent.',
    videoUrl: null,
  }
})
