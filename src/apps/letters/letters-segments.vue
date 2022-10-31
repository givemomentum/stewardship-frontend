<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { LetterSegment, LetterTemplate } from "~/apps/letters/interfaces";
  import { useLetterBatchStore } from "~/apps/letters/useLetterBatchStore";
  import { useApi } from "~/composables/useApi";
  import { Mails } from "lucide-vue-next";
  import { urls } from "~/urls";

  const hooks = {
    api: useApi(),
    batchStore: useLetterBatchStore(),
  };

  const state = {
    segments: ref<LetterSegment[]>([]),
    templateOpen: ref<LetterTemplate | null>(null),

    reviewedTrue: ref(true),
    reviewedFalse: ref(false),
  };

  onMounted(async () => {
    const res = await hooks.api.$get("/letters/segments/");
    state.segments.value = res.data;
  });
</script>

<template>
  <CFlex direction="column" gap="10" pb="8">
    <CFlex direction="column" gap="2" align="flex-start" w="fit-content">

      <CFlex justify="space-between" align="center" w="100%" pr="6">
        <CHeading variant="page-header" font-size="2xl">Batches</CHeading>
        <CButton left-icon="archive" variant="link" size="sm">See all</CButton>
      </CFlex>

      <ChakraTable>
        <chakra.thead>
          <chakra.th>Week</chakra.th>
          <chakra.th>Segment</chakra.th>
          <chakra.th data-is-numeric="true">Letters</chakra.th>
          <chakra.th>Reviewed</chakra.th>
          <chakra.th />
          <chakra.th />
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="batch in hooks.batchStore.list.value.filter(batch => !batch.is_downloaded)"
            :key="batch.pk"
          >
            <chakra.td>{{batch.name || 'Oct 18 - Oct 25' }}</chakra.td>

            <chakra.td>
              {{ batch.segment.name }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              {{ batch.letters_count }}
            </chakra.td>

            <chakra.td data-is-numeric="true">
              <ChakraCheckbox v-if="batch.letters_new_count" v-model="state.reviewedFalse.value" is-disabled />
              <ChakraCheckbox v-else v-model="state.reviewedTrue.value" is-disabled />
            </chakra.td>

            <chakra.td>
              <NuxtLink :to="urls.letters.batchLettersList(batch.pk)">
                <CButton size="sm" variant="link" gap="2">
                  <Mails size="16" />
                  <chakra.span v-if="batch.letters_new_count">Review ({{ batch.letters_new_count }})</chakra.span>
                  <chakra.span v-else>Review</chakra.span>
                </CButton>
              </NuxtLink>
            </chakra.td>

            <chakra.td>
              <CLink :href="batch.zip_file" is-external>
                <CButton size="sm" variant="link" gap="2" left-icon="download">
                  Download
                </CButton>
              </CLink>
            </chakra.td>

          </chakra.tr>
        </chakra.tbody>
      </ChakraTable>
    </CFlex>

    <CFlex direction="column" gap="2">
      <CHeading variant="page-header" font-size="2xl">Segments</CHeading>

      <ChakraTable>
        <chakra.thead>
          <chakra.th>Name</chakra.th>
          <chakra.th>Donation min</chakra.th>
          <chakra.th>Donation max</chakra.th>
          <chakra.th>Recurring filter</chakra.th>
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
    </CFlex>

    <DrawlerSimple v-model="state.templateOpen.value" w="calc(850px + var(--spaces-6) * 2)">
      <LettersTemplateEdit :template="state.templateOpen.value" />
    </DrawlerSimple>

  </CFlex>
</template>
