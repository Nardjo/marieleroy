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
   * Sanitize HTML content using DOMPurify
   * Safe to use with v-html
   */
  const sanitize = (dirty: string | null | undefined): string => {
    if (!dirty) return ''

    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      USE_PROFILES: { html: true },
    })
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
