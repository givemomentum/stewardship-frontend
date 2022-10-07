<script setup lang="ts">
  import { CFlex } from "@chakra-ui/vue-next";
  import useForm from "~/composables/useForm";

  const hooks = {
    form: useForm({
      url: "/account/login",
    }),
  };
</script>

<template>
  <CFlex direction="column">
    hello world
  </CFlex>
</template>
