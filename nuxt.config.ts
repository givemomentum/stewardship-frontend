export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxtjs/emotion", // supposed to be added by @chakra-ui/nuxt-next, but it's broken so I add it manually
    "@formkit/nuxt",
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {
      apiBase: "https://backend.stewardship.givemomentum.com/api",
      accountsBase: "https://backend.stewardship.givemomentum.com/accounts",
      env: "prod",
    },
  },
  components: {
    dirs: [
      "~/components",
      "~/apps/letters",
      "~/apps/tasks",
      "~/apps/fisc",
      "~/apps/partners/hor",
      "~/apps/chakra",
      "~/apps/menu",
      "~/apps/emails",
      "~/apps/shared",
    ],
  },
  ssr: false,
  srcDir: "src/",
  typescript: {
    shim: false, // intellij handles it natively
  },
  vite: {
    build: {
      sourcemap: true,
      minify: false,
    },
  },
});
