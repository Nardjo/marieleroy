const isDev = process.env.NODE_ENV !== 'production'

const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://eu.i.posthog.com https://eu-assets.i.posthog.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    `img-src 'self' data: blob: https://api.dicebear.com${isDev ? ' http://localhost:3000' : ''}`,
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

    routeRules: {
        '/api/**': {
            prerender: false,
        },
        '/uploads/**': {
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
    },

    sentry: {
        sourceMapsUploadOptions: {
            org: 'jordan-bastin',
            project: 'marieleroy',
        },
    },

    sourcemap: {
        client: 'hidden',
    },

    image: {
        provider: 'ipx',
        quality: 80,
        format: ['webp'],
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
