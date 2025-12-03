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
      ctaButtonText: true,
      ctaButtonUrl: true,
      ctaUseDefaultUrl: true,
      ctaUseEmail: true,
      ctaEmailSubject: true,
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
