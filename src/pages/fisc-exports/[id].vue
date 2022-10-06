<script setup lang="ts">
  import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading, CButton, chakra } from "@chakra-ui/vue-next";
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
    headers: ref<string[] | null>(null),
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
    state.headers.value = csv.data.split(/\r?\n/)[0].split(",");
    state.csvData.value = parseResult.data;
    console.log(state.headers.value);
    console.log(state.csvData.value);
  }

  onMounted(() => {
    loadExport();
    loadCSV();
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
        {{ state.export.value.file_name }}
      </CHeading>
      <chakra.table class="table-small" v-if="state.csvData.value">
        <chakra.thead>
          <chakra.tr>
            <chakra.th v-for="header in state.headers.value" :key="header">{{ header }}</chakra.th>
          </chakra.tr>
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="row in state.csvData.value"
            :key="row['DONOR_ID']"
          >
            <chakra.td v-for="header in state.headers.value" :key="header"
                       :data-is-numeric="!isNaN(row[header])">{{ row[header] }}
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
