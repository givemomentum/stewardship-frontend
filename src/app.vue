<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { onMounted } from "vue";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import LogRocket from "logrocket";
  import { configureScope } from "@sentry/vue";
  import * as Sentry from "@sentry/vue";

  const hooks = {
    config: useRuntimeConfig(),
    userStore: useUserStore(),
  };

  useHead({
    titleTemplate: titleChunk => (titleChunk ? `${titleChunk} - Momentum` : "Momentum"),
    link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.webp" }],
    script: [
      {
        children: hooks.config.public.env === "prod" ? `
          (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:3199313,hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        ` : "",
      },
      {
        id: "hs-script-loader",
        src: hooks.config.public.env === "prod" ? "//js.hs-scripts.com/20795930.js" : "",
      },
      { children: `window._hsq = window._hsq ?? [];` },
    ],
  });

  onMounted(async () => {
    await hooks.userStore.loadUser();

    if (!hooks.userStore.isLoggedIn) {
      window.location.href = `${hooks.config.public.accountsBase}/login`;
      return;
    }
    
    Sentry.setUser({
      email: hooks.userStore.user.email,
      id: hooks.userStore.user.pk.toString(),
      name: `${hooks.userStore.user.first_name} ${hooks.userStore.user.last_name}`,
      org: hooks.userStore.user.membership?.org?.name,
      org_pk: hooks.userStore.user.membership?.org?.pk,
      is_org_admin: hooks.userStore.user.membership?.is_org_admin,
      is_enable_app_emails: hooks.userStore.user.membership?.org?.is_enable_app_emails,
      is_enable_app_letters: hooks.userStore.user.membership?.org?.is_enable_app_letters,
    });

    const isNeedToInitAnalytics = (
      hooks.config.public.env === "prod"
      && !hooks.userStore.user.email.endsWith("givemomentum.com")
    );
    if (isNeedToInitAnalytics) {
      
      LogRocket.init("alcw3f/stewardship");

      const hubspot = window._hsq;
      hubspot?.push(["identify", { email: hooks.userStore.user.email }]);

      LogRocket.identify(hooks.userStore.user.email, {
        name: `${hooks.userStore.user.first_name} ${hooks.userStore.user.last_name}`,
        email: hooks.userStore.user.email,
        org: hooks.userStore.user.membership?.org.name,
        is_org_admin: hooks.userStore.user.membership?.is_org_admin,
      });
      LogRocket.getSessionURL(sessionURL => {
        configureScope(scope => {
          scope.setExtra("sessionURL", sessionURL);
        });
      });

      const hotjar = window.hj;
      if (hotjar) {
        hotjar("identify", hooks.userStore.user.email);
      }
    }
  });
</script>

<template>

  <CFlex h="100%" align="stretch">
    <MenuLeft />
    <CFlex px="10" pt="6" pr="6">
      <NuxtPage v-if="hooks.userStore.isLoggedIn" />
    </CFlex>
    
    <!--  for preloading & caching external mce js files, otherwise it takes a while  -->
    <CBox
      v-if="hooks.userStore.user?.membership?.org?.is_enable_app_emails"
      visibility="hidden"
      style="display: none"
    >
      <TinyMce padding="1rem" />
    </CBox>

  </CFlex>

</template>
