<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { LetterSegment, LetterTemplate } from "~/apps/letters/interfaces";
  import { useApi } from "~/composables/useApi";
  import { Mails } from "lucide-vue-next";
  import { urls } from "~/urls";

  const hooks = {
    api: useApi(),
  };

  const state = {
    segments: ref<LetterSegment[]>([]),
    templateOpen: ref<LetterTemplate | null>(null),
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
        <chakra.th>Recurring filter</chakra.th>
        <chakra.th data-is-numeric="true">Batches Unsent</chakra.th>
        <chakra.th />
        <chakra.th />
      </chakra.thead>

      <chakra.tbody>
        <chakra.tr
          v-for="segment in state.segments.value"
          :key="segment.pk"
        >
          <chakra.td>{{segment.name}}</chakra.td>
          <chakra.td data-is-numeric="true">${{ segment.donation_amount_min ?? '0' }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ segment.donation_amount_max ? '$' + segment.donation_amount_max.toLocaleString() : '∞' }}</chakra.td>
          <chakra.td>{{ segment.recurring_filter === 'any' ? '' : segment.recurring_filter.replace('_', ' ').replace('_', ' ') }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ segment.unsent_batches_count }}</chakra.td>

          <chakra.td>
            <NuxtLink :to="urls.letters.segmentBatchList(segment.pk)">
              <CButton size="sm" variant="link" gap="2">
                <Mails size="16" />
                See batches
              </CButton>
            </NuxtLink>
          </chakra.td>

          <chakra.td>
            <CButton
              @click="state.templateOpen.value = segment.template"
              size="sm"
              variant="link"
              gap="px"
              left-icon="edit"
            >
              Template
            </CButton>
          </chakra.td>

        </chakra.tr>
      </chakra.tbody>
    </ChakraTable>

    <DrawlerSimple v-model="state.templateOpen.value" w="calc(850px + var(--spaces-6) * 2)">
      <LettersTemplateEdit :template="state.templateOpen.value" />
    </DrawlerSimple>

  </CFlex>
</template>
