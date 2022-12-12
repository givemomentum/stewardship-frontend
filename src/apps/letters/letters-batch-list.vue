<script setup lang="ts">
  import { useRuntimeConfig } from "#app";
  import { Mails } from "lucide-vue-next";
  import { onBeforeMount, onMounted, ref } from "vue";
  import { POSITION, useToast } from "vue-toastification";
  import { LetterBatch, LetterSegment, LetterTemplate } from "~/apps/letters/interfaces";
  import { useLetterBatchStore } from "~/apps/letters/useLetterBatchStore";
  import { useApi } from "~/composables/useApi";
  import { urls } from "~/urls";

  const hooks = {
    api: useApi(),
    batchStore: useLetterBatchStore(),
    toast: useToast(),
    config: useRuntimeConfig(),
  };

  const state = {
    segments: ref<LetterSegment[]>([]),
    templateOpen: ref<LetterTemplate | null>(null),

    reviewedTrue: ref(true),
    reviewedFalse: ref(false),
  };

  onBeforeMount(async () => {
    await hooks.batchStore.load();
  });

  onMounted(async () => {
    await loadSegments();
  });

  async function loadSegments() {
    const res = await hooks.api.get("/letters/segments/");
    state.segments.value = res.data;
  }

  async function triggerBatchDownload(batch: LetterBatch) {
    await hooks.api.get(`/letters/batches/${batch.pk}/download`);
    await hooks.api.patch(`/letters/batches/${batch.pk}/`, { is_downloaded: true });
    batch.is_downloaded = true;
    await hooks.toast.info(
      "You'll receive an email with the archive once it's ready.",
      { position: POSITION.TOP_RIGHT, timeout: 8 * 1000, pauseOnFocusLoss: false },
    );
    await loadSegments();
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
        <CHeading variant="page-header" font-size="2xl">This week's acknowledgment letters</CHeading>
      </CFlex>

      <ChakraTable>
        <chakra.thead>
          <chakra.th>Date</chakra.th>
          <chakra.th>Segment</chakra.th>
          <chakra.th data-is-numeric="true">Letters</chakra.th>
          <chakra.th data-is-numeric="true">Reviewed</chakra.th>
          <chakra.th data-is-numeric="true">Downloaded</chakra.th>
          <chakra.th />
          <chakra.th />
          <chakra.th />
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="batch in hooks.batchStore.list.value"
            :key="batch.pk"
          >
            <chakra.td>{{ batch.name || 'Oct 18 - Oct 25' }}</chakra.td>

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

            <chakra.td data-is-numeric="true">
              <ChakraCheckbox v-if="batch.is_downloaded" v-model="state.reviewedTrue.value" is-disabled />
              <ChakraCheckbox v-else v-model="state.reviewedFalse.value" is-disabled />
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
              <CButton
                @click="triggerBatchDownload(batch)"
                size="sm"
                variant="link"
                gap="2"
                left-icon="download"
              >
                Letters PDF
              </CButton>
            </chakra.td>

            <chakra.td>
              <CLink
                variant="none"
                :href="`${hooks.config.public.apiBase}/letters/batches/${batch.pk}/labels/download`"
                is-external
              >
                <CButton
                  size="sm"
                  variant="link"
                  gap="2"
                  left-icon="download"
                >
                  Addresses CSV
                </CButton>
              </CLink>
            </chakra.td>

          </chakra.tr>
        </chakra.tbody>
      </ChakraTable>

      <NuxtLink :to="urls.letters.archive" :_hover="{ textDecoration: 'none' }">
        <CButton size="sm" variant="outline" mt="4">See archive</CButton>
      </NuxtLink>
    </CFlex>

    <CFlex direction="column" gap="2">
      <CHeading variant="page-header" font-size="2xl">Templates</CHeading>

      <ChakraTable>
        <chakra.thead>
          <chakra.th>Name</chakra.th>
          <chakra.th data-is-numeric="true">Min donation</chakra.th>
          <chakra.th data-is-numeric="true">Max donation</chakra.th>
          <chakra.th>Gift history</chakra.th>
          <chakra.th />
        </chakra.thead>

        <chakra.tbody>
          <chakra.tr
            v-for="segment in state.segments.value"
            :key="segment.pk"
          >
            <chakra.td>{{ segment.name }}</chakra.td>
            <chakra.td data-is-numeric="true">
              ${{ segment.donation_amount_min?.toLocaleString() ?? "0" }}
            </chakra.td>
            <chakra.td data-is-numeric="true">
              {{ segment.donation_amount_max ? '$' + segment.donation_amount_max?.toLocaleString() : 'Unlimited' }}
            </chakra.td>
            <chakra.td text-transform="capitalize">{{
              segment.gift_history_filter === 'any' ? '' : segment.gift_history_filter.replace('_', ' ').replace('_', ' ')
            }}
            </chakra.td>

            <chakra.td>
              <CButton
                @click="state.templateOpen.value = segment.template"
                size="sm"
                variant="link"
                gap="px"
                left-icon="edit"
              >
                Edit
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