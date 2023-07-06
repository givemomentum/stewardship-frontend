<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { onMounted } from "vue";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import LogRocket from "logrocket";
  import { configureScope } from "@sentry/vue";
  import * as Sentry from "@sentry/vue";
  import { useLayoutControl } from "~/composables/useLayoutControl";

  const hooks = {
    config: useRuntimeConfig(),
    userStore: useUserStore(),
    layout: useLayoutControl(),
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
      // GA
      {
        src: hooks.config.public.env === "prod" ? "https://www.googletagmanager.com/gtag/js?id=G-W1HTKWB5F1" : "",
        async: true,
      },
      {
        children: hooks.config.public.env === "prod" ? `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-W1HTKWB5F1');
        ` : "",
      },

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
      if (window["gtag"]) {
        window["gtag"]("set", {
          email: hooks.userStore.user.email,
          name: `${hooks.userStore.user.first_name} ${hooks.userStore.user.last_name}`,
          org: hooks.userStore.user.membership?.org.name,
        });
      }

      LogRocket.init("alcw3f/stewardship");

      const hubspot = window._hsq;
      hubspot?.push(["identify", { email: hooks.userStore.user.email }]);

      const hotjar = window.hj;
      if (hotjar) {
        hotjar("identify", hooks.userStore.user.email);
      }
    }
  });
</script>

<template>

  <CFlex h="100%" align="stretch">
    <MenuLeft v-if="hooks.layout.isLeftMenuVisible.value" />
    <CFlex
      w="100%"
      :p="hooks.layout.isPaddingEnabled.value ? 6 : 0"
      pb="0"
      :bg="hooks.layout.bg.value"
    >
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

<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/styles/chakra-ui.scss';
</style>
