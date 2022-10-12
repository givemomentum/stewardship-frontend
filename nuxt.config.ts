import { defineNuxtConfig } from "nuxt";
import viteSentry from "vite-plugin-sentry";

export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
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
  ssr: false,
  srcDir: "src/",
  bundleSourceMaps: true,
  vite: {
    build: {
      sourcemap: true,
      minify: false,
    },
    plugins: [
      viteSentry({
        url: "https://sentry.io",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "givemomentum",
        project: "stewardship-frontend",
        release: "1.0",
        deploy: {
          env: "prod"
        },
        setCommits: {
          auto: true
        },
        sourceMaps: {
          include: ["./src"],
        },
      }),
    ],
  },
});
