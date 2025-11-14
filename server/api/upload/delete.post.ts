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

  // Extraire la clé depuis l'URL
  const key = getLocalKeyFromUrl(url)

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL invalide',
    })
  }

  // Supprimer le fichier
  await deleteFromLocal(key)

  return {
    success: true,
    message: 'Fichier supprimé avec succès',
  }
})
