<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { CFlex } from "@chakra-ui/vue-next";
  import { onMounted } from "vue";
  import useUserStore from "~/stores/useUserStore";

  useHead({
    titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - Momentum` : "Momentum"),
    link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.webp" }],
  });

  const hooks = {
    config: useRuntimeConfig(),
    userStore: useUserStore(),
  };

  onMounted(async () => {
    await hooks.userStore.loadUser();
  });
</script>

<template>

  <CFlex h="100%" align="stretch">
    <MenuLeft />

    <CFlex px="10" pt="6">
      <NuxtPage />
    </CFlex>

  </CFlex>

</template>
