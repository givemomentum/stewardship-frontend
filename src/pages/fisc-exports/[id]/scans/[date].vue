<script setup lang="ts">
  import { CFlex, CText, CHeading, chakra } from "@chakra-ui/vue-next";
  import { onMounted, onUnmounted, ref } from "vue";
  import MenuBreadcrumbs from "~/components/menu/menu-breadcrumbs.vue";
  import { useApi } from "~/composables/useApi";
  import { FiscGift, FiscOptOut, PrimaryKey } from "~/interfaces";
  import { useRoute } from "#app";
  import { urls } from "~/urls";
  import { toLocalDate } from "~/utils";

  const hooks = {
    route: useRoute(),
    api: useApi(),
  };

  const state = {
    scans: ref<FiscScan[]>([]),
    scanOpenIndex: ref<number>(null),
    scanOpen: ref<FiscScan>(null),
  };

  onMounted(async () => {
    const res = await hooks.api.$get(`/fisc/scans/?date=${hooks.route.params.date}`);
    state.scans.value = res.data;

    window.addEventListener("keydown", handleKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyUp);
  });

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      changeScanIndex(-1);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      changeScanIndex(+1);
    }
  }

  function changeScanIndex(change: -1 | 1) {
    const scanIndexNew = state.scanOpenIndex.value + change;
    const scanNew = state.scans.value[scanIndexNew];
    if (scanNew) {
      state.scanOpen.value = scanNew;
      state.scanOpenIndex.value = scanIndexNew;
    }
  }

  interface FiscScan {
    pk: PrimaryKey;
    image_front: URL;
    image_back: URL;
    account: number;
    donor_id: number;
    date?: string;
    amount: string;
    gift?: FiscGift;
    optout?: FiscOptOut;
    is_viewed: boolean;
    is_duplicated: boolean;
  }
</script>

<template>
  <CFlex direction="column" gap="7">

    <MenuBreadcrumbs
      :items="[
        { label: 'FISC Exports', url: urls.fiscExport.list },
        { label: toLocalDate(state.scans.value[0]?.date), url: urls.fiscExport.detail($route.params.id) },
        { label: 'Scans', isCurrentPage: true },
      ]" />

    <CHeading variant="page-header">
      Scans for {{ toLocalDate($route.params.date) }}
    </CHeading>

    <ChakraTable size="sm">
      <chakra.thead>
        <chakra.tr>
          <chakra.th>Date</chakra.th>
          <chakra.th data-is-numeric="true">Amount</chakra.th>
          <chakra.th>First Name</chakra.th>
          <chakra.th>Last Name</chakra.th>
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
          <chakra.td>{{ scan.gift?.first_name }}</chakra.td>
          <chakra.td>{{ scan.gift?.last_name }}</chakra.td>
        </chakra.tr>
      </chakra.tbody>
    </ChakraTable>

    <DrawlerSimple v-model="state.scanOpen.value" w="6xl">
      <CFlex
        direction="column"
        p="8"
        gap="4"
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

          <CFlex direction="column">
            <CText font-size="sm" color="gray.500">Is duplicate</CText>
            <CText font-size="2xl" color="purple.500">
              {{ state.scanOpen.value.is_duplicated }}
            </CText>
          </CFlex>

        </CFlex>

        <chakra.img :src="state.scanOpen.value.image_front" />
        <chakra.img :src="state.scanOpen.value.image_back" />
      </CFlex>
    </DrawlerSimple>

  </CFlex>
</template>
