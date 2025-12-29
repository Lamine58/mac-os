// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  // 👉 Pour GitHub Pages (site statique)
  ssr: false,
  nitro: {
    preset: 'github-pages'
  },

  runtimeConfig: {
    public: {
      baseURL: '/mac-os/'
    }
  },

  app: {
    baseURL: '/mac-os/', // nom EXACT du repo GitHub

    pageTransition: { name: 'page', mode: 'out-in' },

    head: {
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'
        }
      ]
    }
  }
})
