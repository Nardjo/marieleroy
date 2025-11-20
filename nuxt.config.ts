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
    devtools: {enabled: true},


    app: {
        head: {
            link: [
                {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
                {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'},
                {rel: 'dns-prefetch', href: 'https://eu.i.posthog.com'},
            ],
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
    ],

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
        // Précharger la page d'accueil (critique)
        '/': {
            prerender: true,
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
        compressPublicAssets: true, // Compression Gzip/Brotli
        prerender: {
            crawlLinks: false, // Disable crawling to reduce memory during build
            routes: ['/'],
        },
    },

    vite: {
        build: {
            target: 'esnext', // Modern JS for smaller bundles
            cssCodeSplit: false, // Split CSS par route
        },
        optimizeDeps: {
            include: ['vue', 'vue-router'],
            exclude: ['vue3-apexcharts', 'apexcharts'], // ApexCharts lazy-loaded
        },
    },

    sentry: {
        sourceMapsUploadOptions: {
            org: 'jordan-bastin',
            project: 'marieleroy',
        },
        // Optimisations Sentry
        // clientIntegrations: {
        //   // Désactiver les intégrations lourdes non essentielles
        //   Replay: false, // Session replay désactivé (lourd)
        //   Feedback: false, // Widget feedback désactivé
        // },
        // Auto-instrumentation allégée
        // Auto-instrumentation allégée
        // autoInstrumentation: {
        //   serverRoutes: false, // Pas besoin côté serveur pour les routes
        // },
    },

    sourcemap: {
        client: 'hidden',
    },

    build: {
        analyze: process.env.ANALYZE === 'true'
            ? {
                analyzerMode: 'static',
                reportFilename: 'bundle-report.html',
                openAnalyzer: true,
            }
            : false,
    },

    image: {
        provider: 'ipx',
        quality: 80,
        format: ['avif', 'webp'],
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
                    format: 'webp',
                    quality: 85,
                    fit: 'cover',
                },
            },
            separator: {
                modifiers: {
                    format: 'webp',
                    quality: 80,
                    fit: 'cover',
                },
            },
            thumbnail: {
                modifiers: {
                    format: 'webp',
                    quality: 75,
                },
            },
        },
    },
})
