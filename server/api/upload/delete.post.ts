import { deleteFromLocal, getLocalKeyFromUrl } from '../../utils/local-storage'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL manquante',
    })
  }

  // Si c'est une image par défaut (depuis /images/), on ne la supprime pas
  if (url.startsWith('/images/') || url.includes('/images/')) {
    return {
      success: true,
      message: 'Image par défaut - aucune suppression nécessaire',
    }
  }

  // Extraire la clé depuis l'URL
  const key = getLocalKeyFromUrl(url)

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL invalide - seuls les fichiers uploadés dans /uploads/ peuvent être supprimés',
    })
  }

  // Supprimer le fichier
  await deleteFromLocal(key)

  return {
    success: true,
    message: 'Fichier supprimé avec succès',
  }
})
