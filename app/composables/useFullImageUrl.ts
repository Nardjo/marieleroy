/**
 * Converts relative image paths to full URLs for NuxtImg remote optimization
 * Returns a computed ref that updates when the path changes
 */
export const useFullImageUrl = (pathOrGetter: MaybeRefOrGetter<string | null | undefined>) => {
  const config = useRuntimeConfig()

  return computed(() => {
    const path = toValue(pathOrGetter)
    if (!path) return null

    // If already a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }

    // Convert relative path to full URL
    return `${config.public.siteUrl}${path}`
  })
}
