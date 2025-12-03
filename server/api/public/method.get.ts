export default defineEventHandler(async () => {
  // Récupérer le header
  const header = await prisma.methodHeader.findFirst({
      select: {
        title: true,
        subtitle: true,
        description: true,
        ctaTitle: true,
        ctaDescription: true,
        ctaButtonText: true,
        ctaButtonUrl: true,
        ctaUseDefaultUrl: true,
      },
    })

    // Récupérer les étapes triées par ordre
    const steps = await prisma.methodStep.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        stepOrder: true,
      },
      orderBy: {
        stepOrder: 'asc',
      },
    })

  return {
    header: header || {
      title: 'Ma Méthode',
      subtitle: 'Étape par étape',
      description: 'Découvrez comment je travaille',
      ctaTitle: 'Besoin d\'un regard expert sur ton marketing ?',
      ctaDescription: 'On analyse ton copywriting ensemble et je te montre ce qui peut réellement booster tes conversions.',
      ctaButtonText: 'Obtenir un audit gratuit',
      ctaButtonUrl: null,
      ctaUseDefaultUrl: true,
    },
    steps: steps || [],
  }
})
