<script setup lang="ts">
import { useHead } from "#app";
import { CContainer, CFlex, CBox } from "@chakra-ui/vue-next";

useHead({
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - Momentum` : "Momentum"),
  link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
});
</script>

<template>
  <CFlex direction="column" overflowX="hidden">
    <CContainer max-w="8xl" :px="[3, null, 4]">
      <NuxtPage />
    </CContainer>
  </CFlex>
</template>
