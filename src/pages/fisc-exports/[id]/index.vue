<script setup lang="ts">
  import { CFlex, CHeading, CButton, chakra } from "@chakra-ui/vue-next";
  import { useRoute } from "#app";
  import { useApi } from "#imports";
  import { captureException } from "@sentry/hub";
  import { onMounted, ref } from "vue";
  import { FiscExport } from "~/interfaces";
  import { urls } from "~/urls";
  import Papa from "papaparse";

  const hooks = {
    route: useRoute(),
    api: useApi(),
  };

  interface CSVData {
    headers: string[],
    rows: any[],
  }

  const state = {
    export: ref<FiscExport | null>(null),
    gifts: ref<CSVData | null>(null),
    optouts: ref<CSVData | null>(null),
  };

  async function loadExport() {
    const res = await hooks.api.$get(`/fisc/exports/${hooks.route.params.id}`);
    state.export.value = res.data;
  }

  async function loadCSV(path: string): Promise<CSVData> {
    const csv = await hooks.api.$get(path);
    const parseResult = Papa.parse(csv.data, { header: true, skipEmptyLines: true });
    if (parseResult.errors.length > 0) {
      captureException(
        new Error("failed to load CSV"),
        { extra: { path, errors: parseResult.errors } },
      );
    }
    return {
      headers: csv.data.split(/\r?\n/)[0].split(","),
      rows: parseResult.data,
    };
  }

  onMounted(() => {
    loadExport();
    loadCSV(`/fisc/exports/${hooks.route.params.id}/download/gifts`).then((result) => {
      state.gifts.value = result;
    });
    loadCSV(`/fisc/exports/${hooks.route.params.id}/download/optout`).then((result) => {
      state.optouts.value = result;
    });
  });
</script>

<template>
  <CFlex direction="column" gap="7">
    <template v-if="state.export.value">
      <CHeading variant="page-header">
        FISC export
      </CHeading>

      <CFlex gap="4">
        <NuxtLink :to="urls.fiscExport.detailScans(state.export.value.pk, state.export.value.date)">
          <CButton borderRadius="6">
            Review scans
          </CButton>
        </NuxtLink>
        <NuxtLink :to="state.export.value.gifts_export_url" target="_blank">
          <CButton borderRadius="6">
            Download gifts CSV
          </CButton>
        </NuxtLink>
        <NuxtLink :to="state.export.value.optout_export_url" target="_blank">
          <CButton borderRadius="6">
            Download optout list
          </CButton>
        </NuxtLink>
      </CFlex>

      <CHeading
        font-size="xl"
        font-weight="semibold"
      >
        Gifts preview
      </CHeading>
      <ChakraTable size="sm" v-if="state.gifts.value">
        <chakra.thead>
          <chakra.tr>
            <chakra.th v-for="header in state.gifts.value.headers" :key="header">{{ header }}</chakra.th>
          </chakra.tr>
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="row in state.gifts.value.rows"
            :key="row['DONOR_ID']"
          >
            <chakra.td
              v-for="header in state.gifts.value.headers"
              :key="header"
              :data-is-numeric="!isNaN(row[header])">{{ row[header] }}
            </chakra.td>
          </chakra.tr>
        </chakra.tbody>
      </ChakraTable>

      <CHeading
        font-size="xl"
        font-weight="semibold"
      >
        Opt-out preview
      </CHeading>

      <ChakraTable size="sm" v-if="state.optouts.value">
        <chakra.thead>
          <chakra.tr>
            <chakra.th v-for="header in state.optouts.value.headers" :key="header">
              {{ header }}
            </chakra.th>
          </chakra.tr>
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="row in state.optouts.value.rows"
            :key="row['DONOR_ID']"
          >
            <chakra.td v-for="header in state.optouts.value.headers" :key="header">
              {{ row[header] }}
            </chakra.td>
          </chakra.tr>
        </chakra.tbody>
      </ChakraTable>
    </template>
  </CFlex>
</template>
