<script setup lang="ts">
  import { CFlex, CHeading, CButton, chakra } from "@chakra-ui/vue-next";
  import { useRoute } from "#app";
  import { useApi } from "#imports";
  import { onMounted, ref } from "vue";
  import { FiscExport } from "~/interfaces";
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
      console.log(parseResult.errors);
      // TODO: log to sentry or something
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
      <CHeading
        font-size="3xl"
        mt="6"
        mb="px"
        font-weight="semibold"
      >
        FISC export: {{ state.export.value.file_name }}
      </CHeading>
      <CFlex gap="4">
        <NuxtLink :to="`/fisc-exports/scans/${state.export.value.date}?export=${state.export.value.pk}`">
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
        Export preview:
      </CHeading>
      <chakra.table class="table-small" v-if="state.gifts.value">
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
      </chakra.table>

      <CHeading
        font-size="xl"
        font-weight="semibold"
      >
        Opt-out list preview:
      </CHeading>
      <chakra.table class="table-small" v-if="state.optouts.value" width="auto">
        <chakra.thead>
          <chakra.tr>
            <chakra.th v-for="header in state.optouts.value.headers" :key="header">{{ header }}</chakra.th>
          </chakra.tr>
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="row in state.optouts.value.rows"
            :key="row['DONOR_ID']"
          >
            <chakra.td v-for="header in state.optouts.value.headers" :key="header">{{ row[header] }}
            </chakra.td>
          </chakra.tr>
        </chakra.tbody>
      </chakra.table>
    </template>
  </CFlex>
</template>

<style lang="scss">
  // TODO: Factor table styles into a component
  .table-small {
    th {
      font-family: var(--fonts-heading);
      font-weight: var(--fontWeights-bold);
      text-transform: uppercase;
      letter-spacing: var(--letterSpacings-wider);
      text-align: start;
      padding-inline-start: var(--space-6);
      padding-inline-end: var(--space-6);
      padding-top: var(--space-3);
      padding-bottom: var(--space-3);
      line-height: var(--lineHeights-4);
      font-size: var(--fontSizes-xs);
      color: var(--colors-gray-600);
      border-color: var(--colors-gray-200);
      border-bottom-width: 1px;
    }

    td {
      text-align: start;
      padding-inline-start: var(--space-6);
      padding-inline-end: var(--space-6);
      padding-top: var(--space-4);
      padding-bottom: var(--space-4);
      line-height: var(--lineHeights-5);
      border-color: var(--colors-gray-200);
      border-bottom-width: 1px;
    }

    th, td {
      &[data-is-numeric=true] {
        text-align: right;
      }
    }
  }
</style>
