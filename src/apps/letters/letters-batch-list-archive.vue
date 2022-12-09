<script setup lang="ts">
  import { useLetterBatchStore } from "~/apps/letters/useLetterBatchStore";
  import { useApi } from "~/composables/useApi";
  import { urls } from "~/urls";
  import { Mails } from "lucide-vue-next";

  const hooks = {
    api: useApi(),
    batchStore: useLetterBatchStore(),
  };
</script>

<template>
  <CFlex direction="column" gap="7" pb="8">
    <CHeading variant="page-header">
      Archive
    </CHeading>

    <ChakraTable>
      <chakra.thead>
        <chakra.th>Week</chakra.th>
        <chakra.th data-is-numeric="true">Letters</chakra.th>
        <chakra.th />
        <chakra.th />
      </chakra.thead>
      <chakra.tbody>
        <chakra.tr
          v-for="batch in hooks.batchStore.list.value.filter(batch => batch.is_downloaded)"
          :key="batch.pk"
        >
          <chakra.td>{{ batch.name }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ batch.letters_count }}</chakra.td>

          <chakra.td>
            <NuxtLink :to="urls.letters.batchLettersList(batch.pk)">
              <CButton size="sm" variant="link" gap="2">
                <Mails size="16" />
                View letters
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
