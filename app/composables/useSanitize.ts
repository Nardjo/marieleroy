import DOMPurify from 'isomorphic-dompurify'

// Configuration DOMPurify pour le contenu Tiptap
const ALLOWED_TAGS = [
  // Structure
  'p', 'br', 'div', 'span',
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Text formatting
  'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  // Lists
  'ul', 'ol', 'li',
  // Links
  'a',
  // Blockquote
  'blockquote',
]

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'class', 'style',
  // Text alignment
  'data-text-align',
]

// Forcer rel="noopener noreferrer" sur les liens externes
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href')
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
  }
})

export const useSanitize = () => {
  /**
   * Remove empty paragraphs and line breaks at the start and end of HTML content
   */
  const trimEmptyParagraphs = (html: string): string => {
    if (!html) return ''

    // Pattern pour les paragraphes vides (avec ou sans espaces/nbsp)
    const emptyParagraphPattern = /<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi

    // Supprimer les paragraphes vides au début
    let result = html.replace(new RegExp(`^(${emptyParagraphPattern.source}\\s*)+`, 'gi'), '')

    // Supprimer les paragraphes vides à la fin
    result = result.replace(new RegExp(`(\\s*${emptyParagraphPattern.source})+$`, 'gi'), '')

    return result.trim()
  }

  /**
   * Sanitize HTML content using DOMPurify
   * Safe to use with v-html
   */
  const sanitize = (dirty: string | null | undefined): string => {
    if (!dirty) return ''

    const sanitized = DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      USE_PROFILES: { html: true },
    })

    // Nettoyer les paragraphes vides au début et à la fin
    return trimEmptyParagraphs(sanitized)
  }

  /**
   * Sanitize HTML and return as computed ref
   * Useful for reactive content
   */
  const sanitizeComputed = (dirty: Ref<string | null | undefined> | ComputedRef<string | null | undefined>) => {
    return computed(() => sanitize(dirty.value))
  }

  return {
    sanitize,
    sanitizeComputed,
  }
}
