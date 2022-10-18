<script setup lang="ts">
  import { CButton, CFlex, CLink, CHeading } from "@chakra-ui/vue-next";
  import { onMounted, ref } from "vue";
  import { useApi } from "~/composables/useApi";
  import { LetterSegment } from "~/interfaces";

  const hooks = {
    api: useApi(),
  };

  const state = {
    segments: ref<LetterSegment[]>([]),
  };

  onMounted(async () => {
    await loadSegments();
  });

  async function loadSegments() {
    const res = await hooks.api.$get(`/ysgn/letter-segments/`);
    state.segments.value = res.data;
  }
</script>

<template>
  <CFlex direction="column" gap="7">
    <CHeading variant="page-header">
      Letter Segments
    </CHeading>

    <ChakraTable>
      <chakra.thead>
        <chakra.tr>
          <chakra.th>Name</chakra.th>
          <chakra.th data-is-numeric="true">Donation Min</chakra.th>
          <chakra.th data-is-numeric="true">Donation Max</chakra.th>
          <chakra.th />
        </chakra.tr>
      </chakra.thead>

      <chakra.tbody>
        <chakra.tr
          v-for="segment in state.segments.value"
          :key="segment.pk"
        >
          <chakra.td>{{ segment.name }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ segment.donation_amount_min ?? 0 }}</chakra.td>
          <chakra.td data-is-numeric="true">{{ segment.donation_amount_max ?? '∞' }}</chakra.td>

          <chakra.td>
            <CLink :href="segment.template.template_file_img" is-external>
              <CButton size="sm" variant="link" left-icon="eye">Preview</CButton>
            </CLink>
          </chakra.td>
        </chakra.tr>
      </chakra.tbody>

    </ChakraTable>
  </CFlex>
</template>
