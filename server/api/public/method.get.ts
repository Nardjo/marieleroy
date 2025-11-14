export default defineEventHandler(async () => {
  // Récupérer le header
  const header = await prisma.methodHeader.findFirst({
    select: {
      title: true,
      subtitle: true,
      description: true,
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
    },
    steps: steps || [],
  }
})
