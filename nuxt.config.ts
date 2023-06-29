import { sentryVitePlugin } from "@sentry/vite-plugin";
import { chakraConfig } from "./src/chakra-config";

export default defineNuxtConfig({
  modules: [
    "@chakra-ui/nuxt-next",
    "@nuxt/ui",
    "@nuxt/devtools",
    "nuxt-icon",
    "@nuxtjs/emotion", // supposed to be added by @chakra-ui/nuxt-next, but it's broken so we add it manually
    "@formkit/nuxt",
    "@pinia/nuxt",
  ],

  runtimeConfig: {
    public: {
      apiBase: "https://backend.app.givemomentum.com/api",
      backendUrl: "https://backend.app.givemomentum.com",
      env: "prod",
    },
  },

  components: {
    dirs: [
      /*
       * To allow Nuxt to register the components in subdirectories
       * you must specify the subdirectory before its parent, eg see portfolios.
       */
      "~/components",
      "~/apps/letters",
      "~/apps/tasks/recs",
      "~/apps/tasks",
      "~/apps/fisc",
      "~/apps/partners/hor",
      "~/apps/chakra",
      "~/apps/menu",
      "~/apps/portfolios/donor-detail",
      "~/apps/portfolios/contact-donor",
      "~/apps/portfolios",
      "~/apps/shared",
    ],
  },

  sourcemap: true,
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
    plugins: [
      sentryVitePlugin({
        org: "givemomentum",
        project: "stewardship-frontend",
        include: ".nuxt/dist/client",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
      }),
    ],
  },

  chakra: chakraConfig as any,

  devtools: {
    enabled: true,
  },
});
