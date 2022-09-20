import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@formkit/nuxt",
  ],
  runtimeConfig: {
    public: {
      apiBase: "https://backend.stewardship.givemomentum.com",
      env: "dev",
    },
  },
  ssr: false,
  srcDir: "src/",
});
