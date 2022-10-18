<script setup lang="ts">
  import { CButton, CFlex, CLink, CHeading } from "@chakra-ui/vue-next";
  import { useApi } from "~/composables/useApi";
  import { useLetterBatchStore } from "~/composables/useLetterBatchStore";
  import { toLocaleDateString } from "~/utils";

  const hooks = {
    api: useApi(),
    batchStore: useLetterBatchStore(),
  };
</script>

<template>
  <CFlex direction="column" gap="7">
    <CHeading variant="page-header">
      Letter Batches
    </CHeading>

    <ChakraTable>
      <chakra.thead>
        <chakra.tr>
          <chakra.th>Date</chakra.th>
          <chakra.th>Segment</chakra.th>
          <chakra.th>Template</chakra.th>
          <chakra.th>Count</chakra.th>
          <chakra.th />
        </chakra.tr>
      </chakra.thead>

      <chakra.tbody>
        <chakra.tr
          v-for="batch in hooks.batchStore.batchList.value"
          :key="batch.pk"
          :color="batch.is_downloaded ? '' : 'blue.500'"
        >
          <chakra.td>{{ toLocaleDateString(batch.created_at) }}</chakra.td>
          <chakra.td>{{ batch.segment.name }}</chakra.td>
          <chakra.td>{{ batch.template.name }}</chakra.td>
          <chakra.td>{{ batch.count }}</chakra.td>

          <chakra.td>
            <CLink
              :href="batch.docx_file"
              is-external
              download
              @click="hooks.batchStore.markAsDownloaded(batch)"
            >
              <CButton size="sm" variant="link" left-icon="download">Download</CButton>
            </CLink>
          </chakra.td>
        </chakra.tr>
      </chakra.tbody>

    </ChakraTable>
  </CFlex>
</template>
