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
    return {
      badgeText: 'Coût de ne rien faire',
      title: 'Ce qui te coûte le plus cher aujourd\'hui…',
      subtitle: 'ce n\'est pas ce que tu ne fais pas assez.<br /><strong class="text-orange-700">C\'est de continuer à tout faire toi-même, sans structure claire ni véritable stratégie.</strong>',
      painPoints: [
        "Créer du contenu non-stop sans vision d'ensemble.",
        "Laisser filer des ventes chaque jour faute d'un système optimisé.",
        "T'épuiser à maintenir un business qui dépend encore trop de toi.",
      ],
      warningTitle: 'Ne rien changer aujourd\'hui = accepter que ton CA plafonne encore des\u00a0mois.',
      warningSubtitle: 'Ton système actuel bride ta croissance et siphonne ton énergie.',
      solutionText1: 'Avec ma méthode, tu récupères du <strong class="text-primary-900">temps</strong>, de la <strong class="text-primary-900">clarté</strong>…',
      solutionText2: '… et tu casses enfin le plafond qui te bloque depuis trop longtemps.',
      solutionHighlight: 'Pour un business qui tourne <span class="text-orange-600">sans toi</span>, <span class="text-primary-600">pour toi</span>.',
      ctaTitle: 'Une question avant de te lancer\u00a0?',
      ctaDescription: 'N\'hésite pas à me contacter directement par mail. Je serai ravie de t\'aider !',
      ctaButtonText: 'Envoyer un message',
      ctaButtonUrl: null,
      ctaUseDefaultUrl: true,
    }
  }

  return section
})
