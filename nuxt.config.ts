export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  supabase: {
    redirect: false
  },
  tailwindcss: {
    viewer: false
  },
  googleFonts: {
    families: { Caveat: [600, 700] },
  },
  css: ["~/assets/css/main.css"]
})
