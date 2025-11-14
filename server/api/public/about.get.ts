export default defineEventHandler(async () => {
  const about = await prisma.aboutSection.findFirst({
    select: {
      title: true,
      subtitle: true,
      description: true,
      imageUrl: true,
    },
  })

  return about || {
    title: 'Marie Leroy',
    subtitle: 'Coach professionnelle',
    description: 'Bienvenue sur mon site',
    imageUrl: null,
  }
})
