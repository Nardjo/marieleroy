import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTestimonials() {
  console.log('🌱 Seeding testimonials...')

  const count = await prisma.testimonial.count()

  if (count > 0) {
    console.log('⏭️  Testimonials déjà présents, seeding ignoré')
    return
  }

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

async function seedAbout() {
  console.log('🌱 Seeding about section...')

  const count = await prisma.aboutSection.count()

  if (count > 0) {
    console.log('⏭️  About section déjà présente, seeding ignoré')
    return
  }

  const about = await prisma.aboutSection.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      title: 'Qui suis-je?',
      subtitle: 'Votre copywriter professionnelle',
      description:
        "Passionnée par l'art de raconter des histoires, je suis une copywriter spécialisée dans la création de contenus qui captivent, engagent et convertissent. Avec plusieurs années d'expérience dans le marketing digital et le copywriting, j'aide les entrepreneurs et les marques à trouver leur voix authentique et à communiquer efficacement avec leur audience.\n\nMa approche combine la stratégie, la psychologie du consommateur et l'art de la narration pour créer des contenus qui résonnent vraiment avec vos clients.",
      imageUrl: '/images/hero.jpg',
    },
  })

  console.log('✅ About section seeded')
  console.log(`   - Title: ${about.title}`)
}

async function seedMethod() {
  console.log('🌱 Seeding method...')

  const headerCount = await prisma.methodHeader.count()
  const stepsCount = await prisma.methodStep.count()

  if (headerCount > 0 || stepsCount > 0) {
    console.log('⏭️  Method déjà présente, seeding ignoré')
    return
  }

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

async function seedFaq() {
  console.log('🌱 Seeding FAQ...')

  const count = await prisma.faq.count()

  if (count > 0) {
    console.log('⏭️  FAQ déjà présente, seeding ignoré')
    return
  }

  await prisma.faq.createMany({
    data: [
      {
        question: 'Quels types de contenus rédigez-vous ?',
        answer:
          'Je rédige une variété de contenus : pages de vente, articles de blog, newsletters, descriptions de produits, et bien plus encore. Chaque contenu est adapté à vos besoins spécifiques et à votre audience cible.',
        displayOrder: 1,
      },
      {
        question: 'Quel est votre processus de travail ?',
        answer:
          'Mon processus se déroule en 5 étapes : consultation initiale pour comprendre vos objectifs, recherche et stratégie pour analyser votre marché, rédaction et optimisation avec des techniques de copywriting éprouvées, révisions pour affiner le contenu, et livraison finale avec suivi.',
        displayOrder: 2,
      },
      {
        question: 'Combien de temps prend un projet ?',
        answer:
          "Le délai varie selon la complexité et l'ampleur du projet. Un article de blog prend généralement 3-5 jours, tandis qu'une page de vente complète peut nécessiter 1-2 semaines. Je vous fournis toujours un calendrier détaillé lors de notre consultation initiale.",
        displayOrder: 3,
      },
      {
        question: 'Proposez-vous des révisions ?',
        answer:
          "Oui, absolument ! Je propose des révisions pour m'assurer que le contenu correspond parfaitement à vos attentes. Le nombre de révisions incluses dépend du forfait choisi, mais je m'engage toujours à vous livrer un contenu qui vous satisfait pleinement.",
        displayOrder: 4,
      },
      {
        question: 'Comment se déroule la première consultation ?',
        answer:
          "La première consultation est un échange approfondi où nous discutons de vos objectifs, votre audience cible, votre positionnement et vos attentes. C'est l'occasion pour moi de comprendre votre projet en détail et de vous proposer une stratégie de contenu adaptée.",
        displayOrder: 5,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ FAQ seeded')
  console.log('   - 5 questions created')
}

async function main() {
  console.log('🚀 Starting database seed...\n')

  try {
    await seedTestimonials()
    await seedAbout()
    await seedMethod()
    await seedFaq()

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
