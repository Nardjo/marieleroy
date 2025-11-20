import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Get the singleton SEO settings record
    const seoSettings = await prisma.sEOSettings.findFirst()

    return seoSettings
  } catch {
    // Return default SEO values if not configured
    return {
      metaTitle: 'Marie Leroy | Copywriter Professionnelle',
      metaDescription:
        'Des mots qui convertissent, des messages qui résonnent. Découvrez mes services de copywriting pour transformer votre contenu.',
      ogImage: null,
    }
  }
})
