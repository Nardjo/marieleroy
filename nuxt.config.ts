import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/image', '@nuxt/ui', '@nuxt/test-utils', '@nuxtjs/device'],

  ui: {
    colorMode: true,
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
    },
    families: [
      {
        name: 'Open Sans',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin', 'latin-ext'],
      },
      {
        name: 'Dancing Script',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal'],
        subsets: ['latin', 'latin-ext'],
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
