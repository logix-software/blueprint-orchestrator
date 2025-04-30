// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
  ],

  compatibilityDate: '2025-04-11',

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:54321',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
  },

  typescript: {
    strict: false,
    shim: false
  },

  app: {
    head: {
      title: 'Analizzatore Ingredienti',
      meta: [
        { name: 'description', content: 'Applicazione per analizzare ingredienti in base a preferenze nutrizionali' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
  ],

  build: {
    transpile: []
  }
})