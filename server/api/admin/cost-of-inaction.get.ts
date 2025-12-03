export default defineEventHandler(async () => {
  const section = await prisma.costOfInactionSection.findFirst({
    select: {
      badgeText: true,
      title: true,
      subtitle: true,
      painPoints: true,
      warningTitle: true,
      warningSubtitle: true,
      solutionText1: true,
      solutionText2: true,
      solutionHighlight: true,
      ctaTitle: true,
      ctaDescription: true,
      ctaButtonText: true,
      ctaButtonUrl: true,
      ctaUseDefaultUrl: true,
    },
  })

  if (!section) {
    throw createError({
      statusCode: 404,
      message: 'Cost of inaction section not found',
    })
  }

  return section
})
