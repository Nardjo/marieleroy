import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer l'en-tête de la méthode
  const header = await prisma.methodHeader.upsert({
    where: { id: 'method-header' },
    update: {},
    create: {
      id: 'method-header',
      title: 'Comment je travaille',
      subtitle: 'étape par étape',
      description: 'Un processus éprouvé pour créer des contenus qui captivent et convertissent votre audience',
    },
  })

  // Créer les étapes de la méthode
  await prisma.methodStep.createMany({
    data: [
      {
        title: 'Consultation initiale',
        description:
          'Nous commençons par une discussion approfondie pour comprendre vos objectifs, votre audience cible et vos attentes.',
        stepOrder: 1,
      },
      {
        title: 'Recherche et stratégie',
        description:
          "J'analyse votre marché, votre concurrence et votre audience pour développer une stratégie de contenu efficace.",
        stepOrder: 2,
      },
      {
        title: 'Rédaction et optimisation',
        description:
          "Je rédis votre contenu en utilisant des techniques de copywriting éprouvées pour maximiser l'impact et les conversions.",
        stepOrder: 3,
      },
      {
        title: 'Révisions et ajustements',
        description:
          "Je travaille avec vous pour affiner le contenu jusqu'à ce qu'il corresponde parfaitement à vos attentes et objectifs.",
        stepOrder: 4,
      },
      {
        title: 'Livraison et suivi',
        description:
          'Je vous livre le contenu final et reste disponible pour des ajustements mineurs et pour répondre à vos questions.',
        stepOrder: 5,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Données de méthode insérées avec succès')
  console.log(`- En-tête: ${header.title}`)
  console.log(`- 5 étapes créées`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
