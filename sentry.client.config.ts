import * as Sentry from '@sentry/nuxt'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://c234d2e498885e3bb345279676f74c62@o4510028549586944.ingest.de.sentry.io/4510380597117008',

    tracesSampleRate: 1.0,

    replaysSessionSampleRate: 0.1,

    replaysOnErrorSampleRate: 1.0,

    integrations: [Sentry.replayIntegration()],

    enableLogs: true,

    debug: false,
  })
}
