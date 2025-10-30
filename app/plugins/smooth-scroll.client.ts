export default defineNuxtPlugin({
  name: 'smooth-scroll',
  hooks: {
    'app:mounted': () => {
      nextTick(() => {
        const hash = window.location.hash
        if (hash) {
          setTimeout(() => {
            const element = document.getElementById(hash.slice(1))
            if (element) {
              const headerHeight = 80
              const elementPosition = element.getBoundingClientRect().top + window.scrollY
              const offsetPosition = elementPosition - headerHeight

              window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth',
              })
            }
          }, 100)
        }
      })
    },
  },
})
