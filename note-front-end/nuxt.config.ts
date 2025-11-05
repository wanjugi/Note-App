// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    // This 'public' block makes environment variables
    // available on both the server and the browser.
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
    }
  }
  
})