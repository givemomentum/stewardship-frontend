<script setup lang="ts">
  import { CFlex, CBox, CButton, CLink, CText, CBadge, CIcon, CHeading, chakra } from "@chakra-ui/vue-next";
  import { onMounted, onUnmounted, ref } from "vue";
  import { useApi } from "~/composables/useApi";
  import { PrimaryKey } from "~/interfaces";
  import { useRoute } from "#app";

  const hooks = {
    route: useRoute(),
    api: useApi(),
  }

  interface FiscScan {
    pk: PrimaryKey;
    image_front: URL;
    image_back: URL;
    account: number;
    donor_id: number;
    date?: string;
    amount: string;
  }

  const state = {
    scans: ref<FiscScan[]>([]),
    scanOpenIndex: ref<number>(null),
    scanOpen: ref<FiscScan>(null)
  };

  onMounted(async () => {
    const res = await hooks.api.$get(`/fisc/scans/?date=${hooks.route.params.date}`);
    const checksNonEmpty = res.data.filter(check => check.date);
    state.scans.value = checksNonEmpty;

    window.addEventListener("keydown", handleKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyUp);
  });

  function handleKeyUp(event) {
    if (event.keyCode === 37) {
      onLeftKeyClick();
    }
    if (event.keyCode === 39) {
      onRightKeyClick();
    }
  }

  function onRightKeyClick() {
    const scanNextIndex = state.scanOpenIndex.value + 1;
    const scanNext = state.scans.value[scanNextIndex];
    if (scanNext) {
      state.scanOpen.value = scanNext;
      state.scanOpenIndex.value = scanNextIndex;
    }
  }

  function onLeftKeyClick() {
    const scanPrevIndex = state.scanOpenIndex.value - 1;
    const scanPrev = state.scans.value[scanPrevIndex];
    if (scanPrev) {
      state.scanOpen.value = scanPrev;
      state.scanOpenIndex.value = scanPrevIndex;
    }
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
      Scans for {{ (new Date($route.params.date)).toLocaleDateString() }}
    </CHeading>

    <NuxtLink :to="`/fisc-exports/${$route.query.export || ''}`">
      <CButton borderRadius="6">
        Back to gifts
      </CButton>
    </NuxtLink>

    <chakra.table class="table-small">
      <chakra.thead>
        <chakra.tr>
          <chakra.th>Date</chakra.th>
          <chakra.th data-is-numeric="true">Amount</chakra.th>
          <chakra.th>Donor ID</chakra.th>
          <chakra.th>Account ID</chakra.th>
          <chakra.th>Scans</chakra.th>
        </chakra.tr>
      </chakra.thead>

      <chakra.tbody>
        <chakra.tr
          v-for="(scan, scanIndex) in state.scans.value"
          :key="scan.pk"
          @click="state.scanOpen.value = scan; state.scanOpenIndex.value = scanIndex"
          :_hover="{
            bg: 'gray.100',
            cursor: 'pointer',
          }"
          :bg="scan.pk === state.scanOpen.value?.pk ? 'gray.200' : ''"
        >
          <chakra.td>{{ (new Date(scan.date)).toLocaleDateString() }}</chakra.td>
          <chakra.td data-is-numeric="true">${{ scan.amount }}</chakra.td>
          <chakra.td>{{ scan.donor_id }}</chakra.td>
          <chakra.td>{{ scan.account }}</chakra.td>
          <chakra.td>
            <CFlex>
              <chakra.img :src="scan.image_front" max-w="200px" min-h="91px" />
              <chakra.img :src="scan.image_back" max-w="200px" min-h="91px" />
            </CFlex>
          </chakra.td>
        </chakra.tr>
      </chakra.tbody>
    </chakra.table>

    <DrawlerSimple v-model="state.scanOpen.value" w="6xl">
      <CFlex
        direction="column"
        p="8"
        gap="4"
        @keyup.left="onLeftKeyClick()"
        @keyup.right="onRightKeyClick()"
      >
        <CFlex gap="8" mb="2" mt="-2" align="center">
          <CFlex direction="column">
            <CText font-size="sm" color="gray.500">Date</CText>
            <CText font-size="2xl" color="blue.500">
              {{ (new Date(state.scanOpen.value.date)).toLocaleDateString() }}
            </CText>
          </CFlex>

          <CFlex direction="column">
            <CText font-size="sm" color="gray.500">Amount</CText>
            <CHeading color="green.500" font-size="2xl">
              ${{ state.scanOpen.value.amount }}
            </CHeading>
          </CFlex>

          <CFlex direction="column">
            <CText font-size="sm" color="gray.500">Donor ID</CText>
            <CText font-size="2xl" color="purple.500">
              {{ state.scanOpen.value.donor_id }}
            </CText>
          </CFlex>

          <CFlex direction="column">
            <CText font-size="sm" color="gray.500">Account ID</CText>
            <CText font-size="2xl" color="purple.500">
              {{ state.scanOpen.value.account }}
            </CText>
          </CFlex>

        </CFlex>

        <chakra.img :src="state.scanOpen.value.image_front" />
        <chakra.img :src="state.scanOpen.value.image_back" />
      </CFlex>
    </DrawlerSimple>

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