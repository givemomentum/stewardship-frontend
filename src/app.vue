<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { CContainer, CIcon, CBox, CLink, CFlex, chakra } from "@chakra-ui/vue-next";
  import { onMounted, ref } from "vue";
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
  
  const state = {
    urlCurrent: ref(""),
  }

  onMounted(async () => {
    await hooks.userStore.loadUser();
    state.urlCurrent.value = window.location.pathname;
  });
</script>

<template>
    
  <CFlex h="100%" align="stretch">
    <CFlex
      direction="column"
      p="6"
      min-w="350px"
      h="auto"
      min-h="100vh"
      color="blue.100"
      bg="blue.800"
      font-size="lg"
    >
      <CBox pl="1">
        <chakra.img src="/momentum-logo.svg" color="white" max-w="200px" />
      </CBox>

      <CFlex direction="column" mt="6" gap="1">
        <template v-if="hooks.userStore.isLoggedIn">
          <CLink
            variant="side-menu"
            href="/"
            :bg="state.urlCurrent.value === '/' ? 'whiteAlpha.300' : ''"
            :color="state.urlCurrent.value  === '/' ? 'white' : ''"
          >
            <CIcon name="task" font-size="2xl" />
            Tasks
          </CLink>
          
          <CLink
            variant="side-menu"
            href="/fisc-scans"
            :bg="state.urlCurrent.value === '/fisc-scans' ? 'whiteAlpha.300' : ''"
            :color="state.urlCurrent.value  === '/fisc-scans' ? 'white' : ''"
          >
            <CIcon name="dollar" font-size="2xl" />
            FISC Scans
          </CLink>
  
          <CLink
            variant="side-menu"
          >
            <CIcon name="people" font-size="2xl" />
            Donors
          </CLink>
          
          <CLink
            variant="side-menu"
          >
            <CIcon name="user" font-size="2xl" />
            Account
          </CLink>
        </template>
        <template v-else>
          <CLink
              variant="side-menu"
              :href="`${hooks.config.public.accountsBase}/login`"
          >
            Login
          </CLink>
          <CLink
              variant="side-menu"
              :href="`${hooks.config.public.accountsBase}/signup`"
          >
            Sign up
          </CLink>
        </template>
      </CFlex>

    </CFlex>

    <CFlex px="10">
      <NuxtPage />
    </CFlex>

  </CFlex>

</template>
