export default defineEventHandler(async () => {
  // Récupérer les paramètres du site
  const settings = await prisma.siteSetting.findMany({
    select: {
      key: true,
      value: true,
    },
  })

  // Récupérer les réseaux sociaux
  const socialLinks = await prisma.socialLink.findMany({
    select: {
      platform: true,
      url: true,
    },
    orderBy: {
      id: 'asc',
    },
  })

  // Récupérer les paramètres SEO
  const seo = await prisma.sEOSettings.findFirst({
    select: {
      metaTitle: true,
      metaDescription: true,
      ogImage: true,
    },
  })

  // Transformer les settings en objet clé-valeur
  const settingsObj = settings.reduce(
    (acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    },
    {} as Record<string, string>,
  )

  return {
    site: {
      name: settingsObj.siteName || 'Marie Leroy',
      description: settingsObj.siteDescription || '',
      email: settingsObj.email || '',
      phone: settingsObj.phone || '',
      address: settingsObj.address || '',
    },
    socialLinks: socialLinks || [],
    seo: seo || null,
  }
})
