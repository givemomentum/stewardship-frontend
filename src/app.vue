<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { CContainer, CBox, CLink, CFlex, chakra } from "@chakra-ui/vue-next";
  import { onMounted } from "vue";
  import useUserStore from "~/stores/useUserStore";
  import { urls } from "~/urls";

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
  <CFlex direction="column">
    <CBox py="4" border-bottom="1px solid" border-color="gray.200" bg="white">
      <CContainer max-w="8xl">

        <CFlex justify="space-between" align="center">
          <chakra.img w="184px" src="momentum-logo.svg" />
        
          <CFlex v-if="hooks.userStore.isLoading">Loading...</CFlex>
          <CFlex v-else direction="column">
            <CFlex v-if="hooks.userStore.isLoggedIn" direction="column">
              <CLink v-on:click="hooks.userStore.logout">Logout</CLink>
            </CFlex>
            <CFlex v-else gap="3">
              <CFlex gap="3" align="center">
                <CLink :href="`${hooks.config.public.serverHostname}${urls.accounts.signup}`">
                  Sign up
                </CLink>
                <CLink :href="`${hooks.config.public.serverHostname}${urls.accounts.login}`">
                  Login
                </CLink>
              </CFlex>
            </CFlex>
          </CFlex>

        </CFlex>

      </CContainer>
    </CBox>

    <CContainer max-w="8xl" pt="4">
      <NuxtPage />
    </CContainer>
  </CFlex>
</template>
