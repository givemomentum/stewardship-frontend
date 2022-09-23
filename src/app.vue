<script setup lang="ts">
  import { useHead } from "#app";
  import { CContainer, CBox, chakra } from "@chakra-ui/vue-next";

  useHead({
    titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - Momentum` : "Momentum"),
    link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  });

</script>

<template>
  <CFlex direction="column">
    <CBox py="4" border-bottom="1px solid" border-color="gray.300">
      <CContainer max-w="8xl">
        <chakra.img w="184px" src="momentum-logo.svg" />
      </CContainer>
    </CBox>

    <CContainer max-w="8xl" pt="4">
      <NuxtPage />
    </CContainer>
  </CFlex>
</template>
