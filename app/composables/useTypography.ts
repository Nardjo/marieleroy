/**
 * Composable pour la typographie française
 * Ajoute des espaces insécables avant la ponctuation française (?, !, :, ;)
 */
export function useTypography() {
  /**
   * Remplace les espaces avant la ponctuation française par des espaces insécables
   * pour éviter que la ponctuation passe seule à la ligne
   */
  const fixPunctuation = (text: string | undefined | null): string => {
    if (!text) return ''
    return text.replace(/ ([?!:;])/g, '\u00A0$1')
  }

  return {
    fixPunctuation,
  }
}
