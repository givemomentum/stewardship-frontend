import { sentryVitePlugin } from "@sentry/vite-plugin";
import { chakraConfig } from "./src/chakra-config";

export default defineNuxtConfig({
  modules: [
    "@chakra-ui/nuxt-next",
    "@nuxt/ui",
    "@nuxtjs/emotion", // supposed to be added by @chakra-ui/nuxt-next, but it's broken so I add it manually
    "@formkit/nuxt",
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {
      apiBase: "https://backend.stewardship.givemomentum.com/api",
      accountsBase: "https://backend.stewardship.givemomentum.com/accounts",
      betaUrl: "https://stage.stewardship.givemomentum.com",
      env: "prod",
    },
  },
  components: {
    dirs: [
      "~/components",
      "~/apps/letters",
      "~/apps/tasks", // todo nuxt resolver is broken, will have to move this to tasks/task
      "~/apps/tasks/recs",
      "~/apps/fisc",
      "~/apps/partners/hor",
      "~/apps/chakra",
      "~/apps/menu",
      "~/apps/emails",
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
});
