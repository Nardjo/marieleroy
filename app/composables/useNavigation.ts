import type { NavigationMenuItem } from '@nuxt/ui'

export const useNavigation = () => {
  const { scrollToSection: originalScrollToSection } = useSmoothScroll()

  const activeSection = ref<string>('hero')
  const isScrolling = ref(false)
  let scrollTimeout: NodeJS.Timeout | null = null

  const initActiveSection = () => {
    if (import.meta.client) {
      const hash = window.location.hash.slice(1)
      if (hash && ['testimonials', 'method', 'about', 'faq', 'cost-of-inaction'].includes(hash)) {
        activeSection.value = hash
      } else {
        activeSection.value = 'hero'
      }
    }
  }

  const observeSection = () => {
    if (import.meta.client) {
      const sections = ['hero', 'testimonials', 'method', 'about', 'faq', 'cost-of-inaction']
      const observer = new IntersectionObserver(
        entries => {
          // Ignorer les changements pendant le scroll programmé
          if (isScrolling.value) return

          // Trier les entrées par leur position dans la page
          const intersectingEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          // Prendre la première section visible (la plus haute)
          if (intersectingEntries.length > 0) {
            const sectionId = intersectingEntries[0].target.id
            if (sections.includes(sectionId)) {
              activeSection.value = sectionId
            }
          }
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: '-100px 0px -50% 0px',
        },
      )

      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element) {
          observer.observe(element)
        }
      })

      onUnmounted(() => {
        observer.disconnect()
      })
    }
  }

  const scrollToSection = (target: string, offset?: number) => {
    const elementId = target.startsWith('#') ? target.slice(1) : target

    // Définir immédiatement la section active
    activeSection.value = elementId

    // Désactiver l'observer pendant le scroll
    isScrolling.value = true

    // Réactiver l'observer après le scroll (smooth scroll prend ~1s)
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      isScrolling.value = false
    }, 1000)

    originalScrollToSection(target, offset)
  }

  onMounted(() => {
    initActiveSection()
    observeSection()
  })

  const items = computed((): NavigationMenuItem[] => [
    {
      label: 'Témoignages',
      class: `cursor-pointer transition-all !text-primary-900 underline underline-offset-2 hover:underline-offset-4 !py-3 !px-4 min-h-[48px] flex items-center ${
        activeSection.value === 'testimonials'
          ? 'underline underline-offset-4 !font-extrabold'
          : '!hover:!text-primary-800'
      }`,
      onClick: () => scrollToSection('testimonials'),
    },
    {
      label: 'Ma méthode',
      class: `cursor-pointer transition-all !text-primary-900 underline underline-offset-2 hover:underline-offset-4 !py-3 !px-4 min-h-[48px] flex items-center ${
        activeSection.value === 'method' ? 'underline underline-offset-4 !font-extrabold' : '!hover:!text-primary-800'
      }`,
      onClick: () => scrollToSection('method'),
    },
    {
      label: 'À propos',
      class: `cursor-pointer transition-all !text-primary-900 underline underline-offset-2 hover:underline-offset-4 !py-3 !px-4 min-h-[48px] flex items-center ${
        activeSection.value === 'about' ? 'underline underline-offset-4 !font-extrabold' : '!hover:!text-primary-800'
      }`,
      onClick: () => scrollToSection('about'),
    },
    {
      label: 'FAQ',
      class: `cursor-pointer transition-all !text-primary-900 underline underline-offset-2 hover:underline-offset-4 !py-3 !px-4 min-h-[48px] flex items-center ${
        activeSection.value === 'faq' ? 'underline underline-offset-4 !font-extrabold' : '!hover:!text-primary-800'
      }`,
      onClick: () => scrollToSection('faq'),
    },
    {
      label: 'Pourquoi agir',
      class: `cursor-pointer transition-all !text-primary-900 underline underline-offset-2 hover:underline-offset-4 !py-3 !px-4 min-h-[48px] flex items-center ${
        activeSection.value === 'cost-of-inaction' ? 'underline underline-offset-4 !font-extrabold' : '!hover:!text-primary-800'
      }`,
      onClick: () => scrollToSection('cost-of-inaction'),
    },
  ])

  return {
    items,
    activeSection: readonly(activeSection),
    scrollToSection,
  }
}
