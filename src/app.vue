<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { CContainer, CIcon, CBox, CLink, CFlex, chakra } from "@chakra-ui/vue-next";
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
            as="RouterLink"
            variant="side-menu"
            to="/"
            :bg="$route.path === '/' ? 'whiteAlpha.300' : ''"
            :color="$route.path  === '/' ? 'white' : ''"
          >
            <CIcon name="task" font-size="2xl" />
            Tasks
          </CLink>

          <CLink
            as="RouterLink"
            variant="side-menu"
            to="/fisc-exports"
            :bg="$route.path === '/fisc-exports' ? 'whiteAlpha.300' : ''"
            :color="$route.path  === '/fisc-exports' ? 'white' : ''"
          >
            <CIcon
              name="oi-table"
              font-size="2xl"
              :fill="$route.path  === '/fisc-exports' ? 'white' : 'blue.100'"
            />
            FISC CSV Exports
          </CLink>

          <CLink
            as="RouterLink"
            variant="side-menu"
            to="/fisc-scans"
            :bg="$route.path === '/fisc-scans' ? 'whiteAlpha.300' : ''"
            :color="$route.path  === '/fisc-scans' ? 'white' : ''"
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
