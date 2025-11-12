import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer des témoignages de test
  await prisma.testimonial.createMany({
    data: [
      {
        title: 'Marie',
        quote: "Grâce à Marie, j'ai pu transformer ma communication et atteindre mes objectifs de manière efficace.",
        embedUrl: 'https://www.youtube.com/embed/KJNbhiD9YLg',
        displayOrder: 1,
      },
      {
        title: 'Jessica',
        quote:
          'Un travail exceptionnel qui a dépassé toutes mes attentes. Ma marque a pris une toute nouvelle dimension.',
        embedUrl: 'https://www.youtube.com/embed/3enzfMLVIbo',
        displayOrder: 2,
      },
      {
        title: 'Lilie',
        quote: "Marie a su capter l'essence de mon message et créer un contenu qui résonne vraiment avec mon audience.",
        embedUrl: 'https://www.youtube.com/embed/3Ah-CkKIKx8',
        displayOrder: 3,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Données de test insérées avec succès')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
