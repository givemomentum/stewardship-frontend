<script setup lang="ts">
  import { preloadComponents } from "#app";
  import { onMounted, ref } from "vue";
  import { LetterSegment } from "~/apps/letters/interfaces";
  import { useApi } from "~/composables/useApi";
  import { Mails } from "lucide-vue-next";
  import { urls } from "~/urls";

  const hooks = {
    api: useApi(),
  };
  
  const state = {
    segments: ref<LetterSegment[]>([]),
  };
  
  onMounted(async () => {
    const res = await hooks.api.$get("/letters/segments/");
    state.segments.value = res.data;
  });
</script>

<template>
  <CFlex direction="column" gap="7" pb="8">
    <MenuBreadcrumbs
      :items="[
        { label: 'Segments', isCurrentPage: true },
      ]"
    />
  
    <ChakraTable>
      <chakra.thead>
        <chakra.th>Name</chakra.th>
        <chakra.th>Donation min</chakra.th>
        <chakra.th>Donation max</chakra.th>
        <chakra.th>Recurring?</chakra.th>
        <chakra.th data-is-numeric="true">Unsent</chakra.th>
        <chakra.th></chakra.th>
      </chakra.thead>
      <chakra.tbody>
        <chakra.tr
          v-for="segment in state.segments.value"
          :key="segment.pk"
        >
          <chakra.td>{{segment.name}}</chakra.td>
          <chakra.td data-is-numeric="true">{{ segment.donation_amount_min?.toLocaleString() ?? '0' }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ segment.donation_amount_max?.toLocaleString() ?? '∞' }}</chakra.td>
          <chakra.td>{{ segment.is_recurring }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ segment.unsent_batches_count }}</chakra.td>

          <chakra.td>
            <NuxtLink :to="urls.letters.segmentBatchList(segment.pk)">
              <CButton size="sm" variant="link" gap="2">
                <Mails size="16" />
                See batches
              </CButton>
            </NuxtLink>
          </chakra.td>
        </chakra.tr>
      </chakra.tbody>
    </ChakraTable>
  </CFlex>
</template>
