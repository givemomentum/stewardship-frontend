<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { CIcon, CBox, CLink, CFlex, chakra } from "@chakra-ui/vue-next";
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
      pr="10"
      h="auto"
      min-h="100vh"
      color="blue.100"
      bg="blue.800"
      font-size="lg"
    >
      <CFlex pl="1" gap="4" align="center">
        <chakra.img src="/momentum-logo.svg" color="white" max-w="185px" />
        <CBox
          mt="7px"
          px="10px"
          py="1px"
          pt="2px"
          bg="blue.100"
          color="blue.900"
          border-radius="lg"
          font-size="xs"
        >
          ALPHA
        </CBox>
      </CFlex>

      <CFlex direction="column" mt="6" gap="1">
        <template v-if="hooks.userStore.isLoggedIn">
          <CLink
            as="RouterLink"
            variant="side-menu"
            to="/"
            :bg="$route.path === '/' ? 'whiteAlpha.300' : ''"
            :color="$route.path === '/' ? 'white' : ''"
          >
            <CIcon name="task" font-size="2xl" />
            Tasks
          </CLink>

          <CLink
            as="RouterLink"
            variant="side-menu"
            to="/fisc-exports"
            :bg="$route.path === '/fisc-exports' ? 'whiteAlpha.300' : ''"
            :color="$route.path === '/fisc-exports' ? 'white' : ''"
          >
            <CIcon
              name="oi-table"
              font-size="2xl"
              :fill="$route.path === '/fisc-exports' ? 'white' : 'blue.100'"
            />
            FISC Exports
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

          <CLink
            v-if="hooks.userStore.user.is_staff"
            :href="`${hooks.config.public.accountsBase}/../admin`"
            variant="side-menu"
          >
            <CIcon name="user" font-size="2xl" />
            Admin Panel
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

    <CFlex px="10" pt="6">
      <NuxtPage />
    </CFlex>

  </CFlex>

</template>
