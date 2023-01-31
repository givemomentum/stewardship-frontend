<script setup lang="ts">
  import { useForm } from "~/composables/useForm";

  const hooks = {
    form: useForm({
      path: "/account/login",
    }),
  };
</script>

<template>
  <CFlex direction="column">
    hello world
  </CFlex>
</template>
