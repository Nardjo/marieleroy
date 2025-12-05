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
      ctaUseEmail: true,
      ctaEmailSubject: true,
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
    if (header?.ctaUseEmail && contactEmail) {
      const subject = header.ctaEmailSubject || ''
      const encodedSubject = encodeURIComponent(subject)
      return `mailto:${contactEmail}${subject ? `?subject=${encodedSubject}` : ''}`
    }
    if (header?.ctaUseDefaultUrl !== false) {
      return defaultCtaLink
    }
    return header?.ctaButtonUrl || defaultCtaLink
  }

  const defaultHeader = {
    title: 'Ma Méthode',
    subtitle: 'Étape par étape',
    description: 'Découvrez comment je travaille',
    ctaTitle: 'Besoin d\'un regard expert sur ton marketing ?',
    ctaDescription: 'On analyse ton copywriting ensemble et je te montre ce qui peut réellement booster tes conversions.',
    ctaButtonText: 'Obtenir un audit gratuit',
    ctaLink: defaultCtaLink,
  }

  return {
    header: header ? {
      title: header.title,
      subtitle: header.subtitle,
      description: header.description,
      ctaTitle: header.ctaTitle,
      ctaDescription: header.ctaDescription,
      ctaButtonText: header.ctaButtonText,
      ctaLink: buildCtaLink(),
    } : defaultHeader,
    steps: steps || [],
  }
})
