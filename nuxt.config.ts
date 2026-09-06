// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss"],
  supabase: {
    redirect: false
  },
  tailwindcss: {
    viewer: false
  },
  css: ["~/assets/css/main.css"]
})
