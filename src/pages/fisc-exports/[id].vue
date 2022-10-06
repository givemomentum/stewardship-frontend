<script setup lang="ts">
  import { useRoute } from "#app";
  import { useApi } from "#imports";
  import { onMounted, ref } from "vue";
  import { FiscExport } from "~/interfaces";
  import Papa from 'papaparse';

  const hooks = {
    route: useRoute(),
    api: useApi(),
  };

  const state = {
    export: ref<FiscExport | null>(null),
    csvData: ref<any[] | null>(null),
  };

  async function loadExport() {
    const res = await hooks.api.$get(`/fisc/exports/${hooks.route.params.id}`);
    state.export.value = res.data;
  }

  async function loadCSV() {
    const csv = await hooks.api.$get(`/fisc/exports/${hooks.route.params.id}/download`)
    const parseResult = Papa.parse(csv.data, { header: true });
    if (parseResult.error) {
      console.log(parseResult.error);
      // TODO: log to sentry or something
    }
    state.csvData.value = parseResult.data;
  }

  onMounted(() => {
    loadExport();
    loadCSV();
  });

</script>

<template>
  <template v-if="state.export.value">
    <p>{{ state.export.value.pk }}</p>
  </template>
</template>
