export default defineEventHandler(async () => {
  const hero = await prisma.heroSection.findFirst({
    select: {
      subtitle: true,
      eyebrow: true,
      bigPromise: true,
      videoUrl: true,
      posterUrl: true,
      avatars: true,
      additionalClientsCount: true,
    },
  })

  if (!hero) {
    throw createError({
      statusCode: 404,
      message: 'Hero section not found',
    })
  }

  return hero
})
