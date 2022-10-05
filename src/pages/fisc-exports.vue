<script setup lang="ts">
import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading, CButton, chakra } from "@chakra-ui/vue-next";
import { onMounted, onUnmounted, ref } from "vue";
import { useApi } from "~/composables/useApi";
import { PrimaryKey } from "~/interfaces";

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

interface FiscExport {
  pk: PrimaryKey;
  org: PrimaryKey;
  date: string;
  is_downloaded: boolean;
  export_url: string;
}
</script>

<template>
  <CFlex direction="column" gap="7">

    <CHeading
        font-size="3xl"
        mt="6"
        mb="px"
        font-weight="semibold"
    >
      CSV Exports
    </CHeading>

    <chakra.table class="table-small">
      <chakra.thead>
        <chakra.tr>
          <chakra.th>Date</chakra.th>
          <chakra.th data-is-numeric="true">Downloaded?</chakra.th>
          <chakra.th></chakra.th>
        </chakra.tr>
      </chakra.thead>

      <chakra.tbody>
        <chakra.tr
            v-for="exportItem in state.exports.value"
            :key="exportItem.pk"
            :_hover="{
            bg: 'gray.100',
            cursor: 'pointer',
          }"
        >
          <chakra.td>{{ (new Date(exportItem.date)).toLocaleDateString() }}</chakra.td>
          <chakra.td data-is-numeric="true">
            <CBox
                ml="auto"
                :bg="exportItem.is_downloaded ? 'blue.500' : 'white'"
                border="1px solid"
                border-color="gray.200"
                w="18px"
                h="18px"
            />
          </chakra.td>
          <chakra.td>
            <a :href="exportItem.export_url" @click="exportItem.is_downloaded=true">
              <CButton size="xs">Download</CButton>
            </a>
          </chakra.td>
        </chakra.tr>
      </chakra.tbody>
    </chakra.table>

  </CFlex>
</template>

<style lang="scss">
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