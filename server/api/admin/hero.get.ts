export default defineEventHandler(async () => {
  const hero = await prisma.heroSection.findFirst({
    select: {
      subtitle: true,
      description: true,
      videoUrl: true,
      avatars: true,
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
