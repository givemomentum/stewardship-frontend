<script setup lang="ts">
  import { useHead, useRuntimeConfig } from "#app";
  import { CContainer, CIcon, CBox, CLink, CFlex, chakra } from "@chakra-ui/vue-next";
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
    
  <CFlex>
    <CFlex
      direction="column"
      p="6"
      min-w="350px"
      h="100vh"
      color="blue.100"
      bg="blue.800"
      font-size="lg"
    >
      <CBox pl="1">
        <chakra.img src="/momentum-logo.svg" color="white" max-w="200px" />
      </CBox>

      <CFlex direction="column" mt="6" gap="1">
        <CLink
          variant="side-menu"
          bg="whiteAlpha.300"
          color="white"
          border-radius="lg"
        >
          <CIcon name="task" font-size="2xl" />
          Tasks
        </CLink>

        <CLink
          variant="side-menu"
        >
          <CIcon name="dollar" font-size="2xl" />
          Donations
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
      </CFlex>

    </CFlex>

    <CFlex px="10">
      <NuxtPage />
    </CFlex>

  </CFlex>

</template>
