import { sentryVitePlugin } from "@sentry/vite-plugin";
import { chakraConfig } from "./src/chakra-config";

export default defineNuxtConfig({
  modules: [
    "@chakra-ui/nuxt-next",
      "@nuxtjs/emotion", // supposed to be added by @chakra-ui/nuxt-next, but the nuxt module is in alpha so we add it manually
    "@nuxt/ui",
    "@nuxt/devtools",
    "nuxt-icon",
    "@pinia/nuxt",
    "floating-vue/nuxt",
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
      {
        path: "~/components",
        pathPrefix: false,
      },
      {
        path: "~/apps",
        pathPrefix: false,
        extensions: [".vue"],
      },
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
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
      }),
    ],
  },

  chakra: chakraConfig as any,

  devtools: {
    enabled: true,
  },

  // didn't work
  // watch: [
  //   "~/chakra-config.ts",
  //   "~/**.ts",
  // ],
});
