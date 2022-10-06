<script setup lang="ts">
  import { useRoute } from "#app";
  import { useApi } from "#imports";
  import { onBeforeMount, onMounted, ref } from "vue";
  import { FiscExport } from "~/interfaces";

  console.log("ID")

  const hooks = {
    route: useRoute(),
    api: useApi(),
  };

  const state = {
    export: ref<FiscExport | null>(null),
  };

  onBeforeMount(async () => {
    const res = await hooks.api.$get(`/fisc/exports/${hooks.route.params.id}`);
    state.export.value = res.data;
  });

</script>

<template>
  <template v-if="state.export.value">
    <p>Hello {{ state.export.value.pk }}</p>
  </template>
</template>
