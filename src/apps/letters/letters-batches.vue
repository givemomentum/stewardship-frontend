<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";
  import { PrimaryKey } from "~/apps/auth/interfaces";
  import { LetterBatch, LetterSegment } from "~/apps/letters/interfaces";
  import { useLetterBatchStore } from "~/apps/letters/useLetterBatchStore";
  import { useApi } from "~/composables/useApi";
  import { urls } from "~/urls";
  import { toLocaleDateString } from "~/utils";
  import { Mails } from "lucide-vue-next";

  const props = defineProps<{
    pk: PrimaryKey;
  }>();

  const hooks = {
    api: useApi(),
    batchStore: useLetterBatchStore(),
  };

  function filterBatches(batchList: LetterBatch[]): LetterBatch[] {
    return batchList.filter(batch => batch.segment.pk === props.pk);
  }
</script>

<template>
  <CFlex direction="column" gap="7" pb="8">
    <MenuBreadcrumbs
      :items="[
        { label: 'Segments', url: urls.letters.segmentList },
        { label: 'Batches', isCurrentPage: true },
      ]"
    />
  
    <ChakraTable>
      <chakra.thead>
        <chakra.th>Date</chakra.th>
        <chakra.th data-is-numeric="true">Letters</chakra.th>
        <chakra.th data-is-numeric="true">New</chakra.th>
        <chakra.th></chakra.th>
        <chakra.th></chakra.th>
      </chakra.thead>
      <chakra.tbody>
        <chakra.tr
          v-for="batch in filterBatches(hooks.batchStore.list.value)"
          :key="batch.pk"
        >
          <chakra.td>{{ toLocaleDateString(batch.created_at) }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ batch.letters_count }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ batch.letters_new_count }}</chakra.td>

          <chakra.td>
            <NuxtLink :to="urls.letters.batchLettersList(batch.pk)">
              <CButton size="sm" variant="link" gap="2">
                <Mails size="16" />
                Review
              </CButton>
            </NuxtLink>
          </chakra.td>
          <chakra.td>
            <CLink :href="batch.zip_file" is-external>
              <CButton size="sm" variant="link" gap="2" left-icon="download">
                Download all
              </CButton>
            </CLink>
          </chakra.td>
        </chakra.tr>
      </chakra.tbody>
    </ChakraTable>
  </CFlex>
</template>
