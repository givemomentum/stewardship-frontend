<script setup lang="ts">
  import { useRuntimeConfig } from "#app";
  import { onBeforeMount, onMounted, ref } from "vue";
  import { PrimaryKey } from "~/apps/auth/interfaces";
  import { useApi } from "~/composables/useApi";

  const hooks = {
    api: useApi(),
    config: useRuntimeConfig(),
  };

  const state = {
    csvs: ref<Csv[]>([]),

    isDownloadedTrue: ref(true),
    isDownloadedFalse: ref(false),
  };

  onBeforeMount(async () => {
    const res = await hooks.api.$get("/csvs/");
    state.csvs.value = res.data;
  });

  onMounted(async () => {
    await loadCsvs();
  });

  async function loadCsvs() {
    const res = await hooks.api.$get("/csvs/");
    state.csvs.value = res.data;
  }

  async function markAsDownloaded(csv: Csv) {
    await hooks.api.$patch(`/csvs/${csv.pk}/`, { is_downloaded: true });
    csv.is_downloaded = true;
    await loadCsvs();
  }

  interface Csv {
    pk: PrimaryKey;
    file: URL;
    date: string;
    is_downloaded: boolean;
  }
</script>

<template>
  <CFlex direction="column" gap="10" pb="8">
    <CFlex
      direction="column"
      gap="2"
      align="flex-start"
      w="fit-content"
    >
      <CFlex justify="space-between" align="center" w="100%" pr="6">
        <CHeading variant="page-header" font-size="2xl">Donation CSVs</CHeading>
      </CFlex>

      <ChakraTable>
        <chakra.thead>
          <chakra.th>Date</chakra.th>
          <chakra.th data-is-numeric="true">Downloaded</chakra.th>
          <chakra.th />
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="csv in state.csvs.value"
            :key="csv.pk"
          >
            <chakra.td>{{ csv.date }}</chakra.td>

            <chakra.td data-is-numeric="true">
              <ChakraCheckbox v-if="csv.is_downloaded" v-model="state.isDownloadedTrue.value" is-disabled />
              <ChakraCheckbox v-else v-model="state.isDownloadedFalse.value" is-disabled />
            </chakra.td>

            <chakra.td>
              <CLink :href="`${hooks.config.public.apiBase}/csvs/${csv.pk}/download`" @click="markAsDownloaded(csv)">
                <CButton
                  size="sm"
                  variant="link"
                  gap="2"
                  left-icon="download"
                >
                  Download
                </CButton>
              </CLink>
            </chakra.td>

          </chakra.tr>
        </chakra.tbody>
      </ChakraTable>
    </CFlex>

  </CFlex>
</template>
