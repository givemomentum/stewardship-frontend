<script setup lang="ts">
  import { CButton, CFlex, CHeading } from "@chakra-ui/vue-next";
  import useUserStore from "~/stores/useUserStore";
  import { useRuntimeConfig } from "#app";

  const hooks = {
    config: useRuntimeConfig(),
    userStore: useUserStore(),
  };
</script>
<template>
  <CFlex direction="column" gap="2">
    <CHeading variant="page-header">
      Account
    </CHeading>
    <div>
      {{ hooks.userStore.user.first_name }} {{ hooks.userStore.user.last_name }}
    </div>
    <div>
      {{ hooks.userStore.user.email }}
    </div>
    <div>
      <CButton @click="hooks.userStore.logout()" mt="2">
        Log out
      </CButton>
    </div>
  </CFlex>
</template>
