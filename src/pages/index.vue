<script setup lang="ts">
import { CFlex, CLink, CText } from "@chakra-ui/vue-next";
import { useRuntimeConfig } from "#app";
import useUserStore from "~/stores/useUserStore";

const hooks = {
  config: useRuntimeConfig(),
  userStore: useUserStore(),
}

hooks.userStore.loadUser();
</script>

<template>
  <CText v-if="hooks.userStore.isLoading">Loading...</CText>
  <div v-else>
    <CFlex v-if="hooks.userStore.isLoggedIn" direction="column" overflowX="hidden">
      <CText>Welcome {{ hooks.userStore.user.firstName }}!</CText>
      <CLink v-on:click="hooks.userStore.logout">Logout</CLink>
    </CFlex>
    <CFlex v-else direction="column" overflowX="hidden">
      <CText>You're logged out</CText>
      <CLink :href="`${hooks.config.public.serverHostname}/accounts/signup`">Sign up</CLink>
      <CLink :href="`${hooks.config.public.serverHostname}/accounts/login`">Login</CLink>
    </CFlex>
  </div>

</template>
