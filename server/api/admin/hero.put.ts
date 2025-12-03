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
      eyebrow: body.eyebrow || null,
      bigPromise: body.bigPromise || null,
      videoUrl: body.videoUrl || null,
      posterUrl: body.posterUrl || null,
      avatars: body.avatars || [],
      additionalClientsCount: Number(body.additionalClientsCount) || 0,
      ctaButtonText: body.ctaButtonText || null,
      ctaButtonUrl: body.ctaButtonUrl || null,
      ctaUseDefaultUrl: body.ctaUseDefaultUrl ?? true,
    },
  })

  return updated
})
