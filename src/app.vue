<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { CFlex } from "@chakra-ui/vue-next";
  import { onMounted } from "vue";
  import useUserStore from "~/stores/useUserStore";

  const hooks = {
    config: useRuntimeConfig(),
    userStore: useUserStore(),
  };

  useHead({
    titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - Momentum` : "Momentum"),
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
    ],
  });

  onMounted(async () => {
    await hooks.userStore.loadUser();
    if (hooks.userStore.isLoggedIn) {
      window.hj("identify", hooks.userStore.user.email);
    } else {
      window.location.href = `${hooks.config.public.accountsBase}/login`;
    }
  });
</script>

<template>

  <CFlex h="100%" align="stretch">
    <MenuLeft />

    <CFlex px="10" pt="6" pr="6">
      <NuxtPage v-if="hooks.userStore.isLoggedIn" />
    </CFlex>

  </CFlex>

</template>
