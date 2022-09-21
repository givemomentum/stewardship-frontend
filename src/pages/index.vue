<script setup lang="ts">
import { CFlex, CLink, CText } from "@chakra-ui/vue-next";
import { useUserStore } from "@/stores/user";

const config = useRuntimeConfig();
const signupLink: string = `${config.public.apiBase}/accounts/signup`;
const loginLink: string = `${config.public.apiBase}/accounts/login`;

const userStore = useUserStore();

userStore.loadUser();
</script>

<template>
  <CText v-if="userStore.isLoading">Loading...</CText>
  <div v-else>
    <CFlex v-if="userStore.isLoggedIn" direction="column" overflowX="hidden">
      <CText>Welcome {{ userStore.user.firstName }}!</CText>
      <CLink v-on:click="userStore.logout">Logout</CLink>
    </CFlex>
    <CFlex v-else direction="column" overflowX="hidden">
      <CText>You're logged out</CText>
      <CLink :href="signupLink">Sign up</CLink>
      <CLink :href="loginLink">Login</CLink>
    </CFlex>
  </div>

</template>
