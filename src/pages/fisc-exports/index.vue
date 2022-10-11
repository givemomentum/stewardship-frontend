<script setup lang="ts">
  import { CFlex, CHeading, CButton, chakra, CLink } from "@chakra-ui/vue-next";
  import { onMounted, ref } from "vue";
  import { useApi } from "~/composables/useApi";
  import { FiscExport } from "~/interfaces";
  import { urls } from "~/urls";
  import { toLocaleDateString } from "~/utils";

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

    <CHeading variant="page-header">
      CSV Exports
    </CHeading>

    <ChakraTable>
      <chakra.thead>
        <chakra.tr>
          <chakra.th>Date</chakra.th>
          <chakra.th data-is-numeric="true">Total</chakra.th>
          <chakra.th data-is-numeric="true">Gifts</chakra.th>
          <chakra.th data-is-numeric="true">Optouts</chakra.th>
          <chakra.th data-is-numeric="true">Scans</chakra.th>
          <chakra.th />
          <chakra.th />
          <chakra.th />
          <chakra.th />
        </chakra.tr>
      </chakra.thead>

      <chakra.tbody>
        <chakra.tr
          v-for="exportItem in state.exports.value"
          :key="exportItem.pk"
        >
          <chakra.td>{{ toLocaleDateString(exportItem.date) }}</chakra.td>
          <chakra.td data-is-numeric="true">
            ${{ new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(exportItem.donation_total) }}
          </chakra.td>
          <chakra.td data-is-numeric="true">
            {{ exportItem.num_gifts }}
          </chakra.td>

          <chakra.td data-is-numeric="true">
            {{ exportItem.num_optouts }}
          </chakra.td>
          
          <chakra.td data-is-numeric="true">
            {{ exportItem.num_scans }}
          </chakra.td>

          <chakra.td>
            <NuxtLink :to="urls.fiscExport.detailScans(exportItem.pk, exportItem.date)">
              <CButton
                size="sm"
                variant="link"
                left-icon="search"
                :font-weight="exportItem.num_scans_unread ? 'bold' : ''"
              >
                <chakra.span v-if="exportItem.num_scans_unread">
                  Scans ({{ exportItem.num_scans_unread }})
                </chakra.span>
                <chakra.span v-else>Scans</chakra.span>
              </CButton>
            </NuxtLink>
          </chakra.td>

          <chakra.td>
            <CLink :href="exportItem.gifts_export_url" is-external>
              <CButton size="sm" variant="link" left-icon="download">Gifts</CButton>
            </CLink>
          </chakra.td>

          <chakra.td>
            <CLink :href="exportItem.optout_export_url" is-external>
              <CButton size="sm" variant="link" left-icon="download">Oputouts</CButton>
            </CLink>
          </chakra.td>

          <chakra.td>
            <NuxtLink :to="urls.fiscExport.detail(exportItem.pk)">
              <CButton size="sm" variant="link" left-icon="eye">View</CButton>
            </NuxtLink>
          </chakra.td>
        </chakra.tr>
      </chakra.tbody>
    </ChakraTable>

  </CFlex>
</template>
