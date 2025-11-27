const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://eu.i.posthog.com https://eu-assets.i.posthog.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
  `img-src 'self' data: blob: https://api.dicebear.com https://img.youtube.com`,
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://eu.i.posthog.com https://eu-assets.i.posthog.com https://*.sentry.io https://fonts.googleapis.com https://fonts.gstatic.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),
  'trusted-types default dompurify vue posthog',
].join('; ')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        'lang': 'fr',
        'data-theme': 'vitrine', // Default theme for SSR
      },
      link: [{ rel: 'dns-prefetch', href: 'https://eu.i.posthog.com' }],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxtjs/device',
    '@vueuse/motion/nuxt',
    'nuxt-auth-utils',
    '@sentry/nuxt/module',
    'nuxt-posthog',
    'nuxt-tiptap-editor',
  ],

  tiptap: {
    prefix: 'Tiptap',
  },

  runtimeConfig: {
    posthogProjectId: process.env.POSTHOG_PROJECT_ID,
    posthogPersonalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
    posthogHost: process.env.POSTHOG_HOST || 'https://eu.i.posthog.com',

    public: {
      siteName: 'Marie Leroy',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  colorMode: {
    preference: 'light', // Default to light mode (prevents dark mode flash on SSR)
    fallback: 'light',
    classSuffix: '',
  },

  ui: {
    // Optimisations Nuxt UI
    fonts: false, // On utilise déjà @nuxt/fonts
    content: false, // Pas de @nuxt/content
    mdc: false, // Pas de MDC

    // Limiter aux couleurs utilisées
    theme: {
      transitions: false, // Désactiver les transitions CSS inutilisées
      colors: ['primary', 'error', 'neutral', 'success', 'warning', 'info'],
    },
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'], // Réduit: removed latin-ext pour réduire la taille
    },
    families: [
      {
        name: 'Barlow',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin'],
        display: 'swap', // Performance: affiche le texte immédiatement avec fallback
        preload: true, // Preload critical font
      },
      {
        name: 'Dancing Script',
        provider: 'google',
        weights: [400],
        styles: ['normal'],
        subsets: ['latin'],
        display: 'swap', // Affiche le fallback puis swap vers Dancing Script
      },
    ],
  },

  routeRules: {
    '/api/**': {
      prerender: false,
    },
    '/uploads/**': {
      prerender: false,
      // Cache-Control défini dans server/routes/uploads/[...path].get.ts
    },
    '/_ipx/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache 1 an pour images IPX
      },
    },
    '/_nuxt/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache 1 an pour les assets JS/CSS
      },
    },
    '/favicon.ico': {
      headers: {
        'Cache-Control': 'public, max-age=86400, immutable', // Cache 1 jour
      },
    },
    // Page d'accueil: SSR pour afficher les données à jour
    '/': {
      prerender: false,
    },
    // Pages admin: pas de prerender, chargées à la demande
    '/admin/**': {
      prerender: false,
    },
    '/**': {
      headers: {
        'Content-Security-Policy': cspDirectives,
        'Cross-Origin-Opener-Policy': 'same-origin',
        'X-Frame-Options': 'DENY',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },

  posthog: {
    publicKey: process.env.NUXT_PUBLIC_POSTHOG_KEY,
    host: 'https://eu.i.posthog.com',
    disabled: !process.env.NUXT_PUBLIC_POSTHOG_KEY,
  },

  nitro: {
    experimental: {
      wasm: true,
    },
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    minify: true, // Minify server output
  },

  experimental: {
    payloadExtraction: true, // Extract payload to reduce JS bundle
  },

  vite: {
    build: {
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'], // Modern browsers only, no transpilation
      cssCodeSplit: true, // Split CSS par route pour réduire le bundle initial
      minify: 'esbuild', // Minification rapide avec esbuild
      cssMinify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            motion: ['@vueuse/motion'],
            sentry: ['@sentry/nuxt'], // Separate Sentry chunk
          },
        },
      },
    },
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      exclude: ['vue3-apexcharts', 'apexcharts'], // ApexCharts lazy-loaded
    },
    ssr: {
      noExternal: ['@nuxt/ui'], // Bundle @nuxt/ui for better tree-shaking
    },
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: 'jordan-bastin',
      project: 'marieleroy',
    },
    // Optimisations Sentry
    // Auto-instrumentation allégée
  },

  sourcemap: {
    client: 'hidden',
  },

  build: {
    analyze:
      process.env.ANALYZE === 'true'
        ? {
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html',
            openAnalyzer: true,
          }
        : false,
  },

  image: {
    provider: 'ipx',
    quality: 75, // Réduction de 80 à 75 pour meilleure compression
    format: ['avif', 'webp'], // AVIF en priorité (meilleure compression)
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    densities: [1, 2],
    domains: ['api.dicebear.com'],
    ipx: {
      maxAge: 31536000, // Cache IPX images for 1 year
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'avif', // AVIF pour meilleure compression
          quality: 70, // Réduit de 85 à 70
          fit: 'cover',
        },
      },
      separator: {
        modifiers: {
          format: 'avif', // AVIF pour meilleure compression
          quality: 65, // Réduit de 80 à 65
          fit: 'cover',
        },
      },
      thumbnail: {
        modifiers: {
          format: 'avif', // AVIF pour meilleure compression
          quality: 60, // Réduit de 75 à 60
        },
      },
    },
  },
})
