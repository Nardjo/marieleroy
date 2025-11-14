export default defineEventHandler(async event => {
  const body = await readBody(event)

  console.log('[HERO PUT] Body reçu:', JSON.stringify(body, null, 2))
  console.log('[HERO PUT] avatars:', body.avatars)
  console.log('[HERO PUT] avatars type:', typeof body.avatars)
  console.log('[HERO PUT] avatars is array:', Array.isArray(body.avatars))

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

  console.log('[HERO PUT] Updated:', JSON.stringify(updated, null, 2))

  return updated
})
