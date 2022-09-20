<script setup lang="ts">
import { useHead } from "#app";
import { CContainer, CFlex, CBox } from "@chakra-ui/vue-next";
import Menu from "~/components/eightyk/menu";

useHead({
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - EA Work` : "EA Work"),
  link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
});
</script>

<template>
  <CFlex direction="column" overflowX="hidden">
    <Menu />

    <CBox bg="#F4F6F7">
      <CContainer max-w="8xl" :px="[3, null, 4]">
        <NuxtPage />
      </CContainer>
    </CBox>
  </CFlex>
</template>
