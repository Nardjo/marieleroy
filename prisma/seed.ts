import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTestimonials() {
  console.log('🌱 Seeding testimonials...')
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
  console.log('✅ Testimonials seeded')
}

async function seedMethod() {
  console.log('🌱 Seeding method...')

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
          "Je rédige votre contenu en utilisant des techniques de copywriting éprouvées pour maximiser l'impact et les conversions.",
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

  console.log('✅ Method seeded')
  console.log(`   - Header: ${header.title}`)
  console.log(`   - 5 steps created`)
}

async function main() {
  console.log('🚀 Starting database seed...\n')

  try {
    await seedTestimonials()
    await seedMethod()

    console.log('\n✨ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
