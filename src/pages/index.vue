<script setup lang="ts">
import { CFlex, CText, CLink } from "@chakra-ui/vue-next";

const config = useRuntimeConfig();
const signupLink: string = `${config.public.apiBase}/accounts/signup`;
const loginLink: string = `${config.public.apiBase}/accounts/login`;

</script>

<template>
  <CFlex direction="column" overflowX="hidden">
    <CText>Welcome to Momentum!</CText>
    <CLink :href="signupLink">Sign up</CLink>
    <CLink :href="loginLink">Login</CLink>
  </CFlex>
</template>
