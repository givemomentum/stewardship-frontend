import { defineNuxtPlugin } from "#app";
import * as Sentry from "@sentry/vue";

/**
 * copy of https://github.com/nuxt-community/sentry-module/issues/358#issuecomment-1016983543
 */
export default defineNuxtPlugin(nuxtApp => {
  if (nuxtApp.$config.public.env !== "dev") {
    Sentry.init({
      app: [nuxtApp.vueApp],
      dsn: "https://4c2d00b85972416ea396bc900e4a8b08@o359384.ingest.sentry.io/6763294",
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        new Sentry.Replay({
          maskAllInputs: false,
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      environment: nuxtApp.$config.public.env ?? "prod",
    });

    nuxtApp.vueApp.mixin(
      Sentry.createTracingMixins({
        trackComponents: true,
        timeout: 2000,
        hooks: ["activate", "mount", "update"],
      }),
    );
    Sentry.attachErrorHandler(nuxtApp.vueApp, {
      logErrors: false,
      attachProps: true,
      trackComponents: true,
      timeout: 2000,
      hooks: ["activate", "mount", "update"],
    });
  }
});
