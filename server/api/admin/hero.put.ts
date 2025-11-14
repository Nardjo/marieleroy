export default defineEventHandler(async event => {
  const body = await readBody(event)

  const hero = await prisma.heroSection.findFirst()

  if (!hero) {
    throw createError({
      statusCode: 404,
      message: 'Hero section not found',
    })
  }

  const updated = await prisma.heroSection.update({
    where: { id: hero.id },
    data: {
      subtitle: body.subtitle,
      description: body.description,
      videoUrl: body.videoUrl || null,
      avatars: body.avatars || [],
    },
  })

  return updated
})
