import { defineNuxtPlugin } from "#app";
import { attachErrorHandler, createTracingMixins, getCurrentHub, init, setContext, Replay, EventHint } from "@sentry/vue";
import { useUserStore } from "~/apps/auth/useUserStore";
import { useApi } from "~/composables/useApi";
import { AxiosError } from "axios";

/**
 * copy of https://github.com/nuxt-community/sentry-module/issues/358#issuecomment-1016983543
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  if (nuxtApp.$config.public.env !== "dev") {
    init({
      app: [nuxtApp.vueApp],
      dsn: "https://4c2d00b85972416ea396bc900e4a8b08@o359384.ingest.sentry.io/6763294",
      tracesSampleRate: 1.0,
      release: "0.4.0.2",
      replaysSessionSampleRate: 1.0,
      replaysOnErrorSampleRate: 1.0,
      integrations: [],
      environment: nuxtApp.$config.public.env ?? "prod",
      beforeSend: async function (event, hint: EventHint) {
        const isRlsValid = await checkIsRlsValid(nuxtApp);
        if (!isRlsValid) {
          console.log("another user with wrong bloody org set, i'm not gonna waste my time in sentry on this");
          return null;
        }

        if (hint.originalException instanceof AxiosError && event.request) {
          setContext("axios error", {
            request: hint.originalException?.request?.responseURL,
          });
          event.message = hint.originalException?.request?.responseURL;
          const exception = event.exception?.values[0] as any;
          if (exception.value) {
            exception.value = hint.originalException?.request?.responseURL;
          }
          event.fingerprint = [
            hint.originalException?.request?.responseURL,
            "{{ default }}",
          ];
        }

        return event;
      },
    });

    nuxtApp.vueApp.mixin(
      createTracingMixins({
        trackComponents: true,
        timeout: 2000,
        hooks: ["activate", "mount", "update"],
      }),
    );
    attachErrorHandler(nuxtApp.vueApp, {
      logErrors: false,
      attachProps: true,
      trackComponents: true,
      timeout: 2000,
      hooks: ["activate", "mount", "update"],
    });

    // todo call /users/me only in one place of the code
    const api = useApi();
    try {
      const userRes = await api.get("/users/me/");
      if (userRes.status === 200) {
        getCurrentHub().getClient().addIntegration(new Replay({
          maskAllInputs: false,
          maskAllText: false,
          blockAllMedia: false,
          networkDetailAllowUrls: [
            "backend.app.givemomentum.com",
            "localhost:8000",
          ],
        }));
      }
    } catch {
      // ignore
    }
  }
});

async function checkIsRlsValid(nuxtApp: any) {
  const userStore = useUserStore();
  const api = useApi();
  if (userStore.isLoggedIn && userStore.user?.is_momentum_admin) {
    const portfolioId = nuxtApp?._route?.params?.portfolio_id;
    if (portfolioId) {
      const isValid = await api.getJson(`/auth/validate-rls`, {
        params: {
          portfolio_id: portfolioId,
        },
      });
      return isValid;
    }
  }
  return true;
}
