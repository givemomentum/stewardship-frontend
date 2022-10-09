<script setup lang="ts">
  import { CFlex, CHeading, CButton, chakra } from "@chakra-ui/vue-next";
  import { onMounted, ref } from "vue";
  import { useApi } from "~/composables/useApi";
  import { FiscExport } from "~/interfaces";
  import { urls } from "~/urls";
  import { toLocalDate } from "~/utils";

  const hooks = {
    api: useApi(),
  };

  const state = {
    exports: ref<FiscExport[]>([]),
  };

  onMounted(async () => {
    const res = await hooks.api.$get("/fisc/exports/");
    state.exports.value = res.data;
  });
</script>

<template>
  <CFlex direction="column" gap="7">

    <CHeading
      font-size="3xl"
      mb="px"
      font-weight="semibold"
    >
      CSV Exports
    </CHeading>

    <ChakraTable>
      <chakra.thead>
        <chakra.tr>
          <chakra.th>Date</chakra.th>
          <chakra.th data-is-numeric="true">Donation total</chakra.th>
          <chakra.th data-is-numeric="true">Gifts</chakra.th>
          <chakra.th data-is-numeric="true">Scans</chakra.th>
          <chakra.th />
        </chakra.tr>
      </chakra.thead>

      <chakra.tbody>
        <chakra.tr
          v-for="exportItem in state.exports.value"
          :key="exportItem.pk"
        >
          <chakra.td>{{ toLocalDate(exportItem.date) }}</chakra.td>
          <chakra.td data-is-numeric="true">
            ${{ exportItem.donation_total }}
          </chakra.td>
          <chakra.td data-is-numeric="true">
            {{ exportItem.num_gifts }}
          </chakra.td>
          <chakra.td data-is-numeric="true">
            {{ exportItem.num_scans }}
          </chakra.td>
          <chakra.td>
            <NuxtLink :to="urls.fiscExport.detail(exportItem.pk)">
              <CButton size="sm">Review</CButton>
            </NuxtLink>
          </chakra.td>
        </chakra.tr>
      </chakra.tbody>
    </ChakraTable>

  </CFlex>
</template>
