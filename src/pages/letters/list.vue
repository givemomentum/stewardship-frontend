<script setup lang="ts">
  import { CButton, CFlex, CLink, CHeading } from "@chakra-ui/vue-next";
  import { ref } from "vue";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";
  import { useApi } from "~/composables/useApi";

  const hooks = {
    api: useApi(),
    menu: useLeftMenu(),
  };
  
  const state = {
    letterHtml: ref(""),
  };
</script>

<template>
  <CFlex direction="column" gap="7">
    <CHeading variant="page-header">
      Editor
    </CHeading>

    
  </CFlex>
</template>
