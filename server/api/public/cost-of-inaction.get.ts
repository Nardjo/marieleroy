export default defineEventHandler(async () => {
  const section = await prisma.costOfInactionSection.findFirst({
    select: {
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
      ctaUseEmail: true,
      ctaEmailSubject: true,
    },
  })

  // Récupérer les settings pour le lien CTA par défaut et l'email
  const settingsRaw = await prisma.siteSetting.findMany({
    where: { key: { in: ['cta_link', 'email'] } },
    select: { key: true, value: true },
  })
  const settingsMap = Object.fromEntries(settingsRaw.map(s => [s.key, s.value]))

  const defaultCtaLink = settingsMap.cta_link || '#'
  const contactEmail = settingsMap.email || ''

  // Construire le lien CTA final
  const buildCtaLink = () => {
    if (section?.ctaUseEmail && contactEmail) {
      const subject = section.ctaEmailSubject || ''
      const encodedSubject = encodeURIComponent(subject)
      return `mailto:${contactEmail}${subject ? `?subject=${encodedSubject}` : ''}`
    }
    if (section?.ctaUseDefaultUrl !== false) {
      return defaultCtaLink
    }
    return section?.ctaButtonUrl || defaultCtaLink
  }

  if (!section) {
    return {
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
      ctaLink: defaultCtaLink,
    }
  }

  return {
    title: section.title,
    subtitle: section.subtitle,
    painPoints: section.painPoints,
    warningTitle: section.warningTitle,
    warningSubtitle: section.warningSubtitle,
    solutionText1: section.solutionText1,
    solutionText2: section.solutionText2,
    solutionHighlight: section.solutionHighlight,
    ctaTitle: section.ctaTitle,
    ctaDescription: section.ctaDescription,
    ctaButtonText: section.ctaButtonText,
    ctaLink: buildCtaLink(),
  }
})
