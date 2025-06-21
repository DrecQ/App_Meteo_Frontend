// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    'nuxt-icon',
    // '@nuxtjs/i18n'
  ],
  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'METEO-BENIN',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Application météo pour le Bénin' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  router: {
    options: {
      strict: false
    }
  },
  runtimeConfig: {
    openrouterApiKey: process.env.NUXT_OPENROUTER_API_KEY || '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', // Test temporaire
    public: {
      // Clés publiques
    }
  },
  // i18n: {
  //   locales: [
})