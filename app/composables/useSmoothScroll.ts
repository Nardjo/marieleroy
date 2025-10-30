export const useSmoothScroll = () => {
  const scrollToSection = (target: string, offset: number = 80) => {
    if (import.meta.server) return

    const elementId = target.startsWith('#') ? target.slice(1) : target
    const element = document.getElementById(elementId)

    if (!element) {
      return
    }

    const newUrl = elementId === 'hero' ? '/' : `/#${elementId}`
    window.history.pushState({}, '', newUrl)

    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    })
  }

  const scrollToHashOnMount = () => {
    if (import.meta.server) return

    nextTick(() => {
      const hash = window.location.hash
      if (hash) {
        setTimeout(() => {
          scrollToSection(hash)
        }, 100)
      }
    })
  }

  return {
    scrollToSection,
    scrollToHashOnMount,
  }
}
