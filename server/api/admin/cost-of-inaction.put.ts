export default defineEventHandler(async event => {
  const body = await readBody(event)

  const section = await prisma.costOfInactionSection.findFirst()

  if (!section) {
    throw createError({
      statusCode: 404,
      message: 'Cost of inaction section not found',
    })
  }

  const updated = await prisma.costOfInactionSection.update({
    where: { id: section.id },
    data: {
      badgeText: body.badgeText || 'Coût de ne rien faire',
      title: body.title || 'Ce qui te coûte le plus cher aujourd\'hui…',
      subtitle: body.subtitle || null,
      painPoints: body.painPoints || [],
      warningTitle: body.warningTitle || null,
      warningSubtitle: body.warningSubtitle || null,
      solutionText1: body.solutionText1 || null,
      solutionText2: body.solutionText2 || null,
      solutionHighlight: body.solutionHighlight || null,
      ctaTitle: body.ctaTitle || null,
      ctaDescription: body.ctaDescription || null,
      ctaButtonText: body.ctaButtonText || null,
      ctaButtonUrl: body.ctaButtonUrl || null,
      ctaUseDefaultUrl: body.ctaUseDefaultUrl ?? true,
      ctaUseEmail: body.ctaUseEmail ?? false,
      ctaEmailSubject: body.ctaEmailSubject || null,
    },
  })

  return updated
})
