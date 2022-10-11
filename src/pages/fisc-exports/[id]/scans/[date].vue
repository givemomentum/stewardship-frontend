<script setup lang="ts">
  import { useRoute } from "#app";
  import { CFlex, chakra, CBox } from "@chakra-ui/vue-next";
  import { onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
  import MenuBreadcrumbs from "~/components/menu/menu-breadcrumbs.vue";
  import { useApi } from "~/composables/useApi";
  import { useLeftMenu } from "~/composables/useLeftMenu";
  import { FiscScan } from "~/interfaces";
  import { urls } from "~/urls";
  import { toLocaleDateString } from "~/utils";

  const hooks = {
    route: useRoute(),
    api: useApi(),
    menu: useLeftMenu(),
  };

  const state = {
    scans: ref<FiscScan[]>([]),
    scanOpenIndex: ref<number>(null),
    scanOpen: ref<FiscScan>(null),
  };

  const tableRefs = ref([]);

  onBeforeMount(() => {
    hooks.menu.collapse();
  });

  onMounted(async () => {
    await loadScans();
    window.addEventListener("keydown", handleKeyUp);
  });

  onUnmounted(() => {
    hooks.menu.unfold();
    window.removeEventListener("keydown", handleKeyUp);
  });

  watch(state.scanOpen, async (scanNew) => {
    if (!scanNew.is_viewed) {
      await hooks.api.$patch(`/fisc/scans/${scanNew.pk}/`, { is_viewed: true });
      scanNew.is_viewed = true;
    }
  });

  async function loadScans() {
    const res = await hooks.api.$get(`/fisc/scans/?date=${hooks.route.params.date}`);
    state.scans.value = res.data;
  }

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

      // doesn't work wo setTimeout, prob a Vue render issue
      setTimeout(() => {
        tableRefs.value[scanIndexNew].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
    }
  }
</script>

<template>
  <CFlex gap="4" pb="8">

    <CFlex direction="column">

      <MenuBreadcrumbs
        :items="[
          { label: 'FISC Exports', url: urls.fiscExport.list },
          {
            label: state.scans.value[0] ? toLocaleDateString(state.scans.value[0]?.date) : '00/00/2022',
            url: urls.fiscExport.detail($route.params.id),
          },
          { label: 'Scans', isCurrentPage: true },
        ]"
      />

      <CFlex h="fit-content">
        <ChakraTable size="sm" min-w="370px" mt="8">
          <chakra.thead>
            <chakra.tr>
              <chakra.th>Donor ID</chakra.th>
              <chakra.th>Name</chakra.th>
              <chakra.th data-is-numeric="true">Amount</chakra.th>
              <chakra.th>Duplicate</chakra.th>
            </chakra.tr>
          </chakra.thead>

          <chakra.tbody>
            <!-- <tr ref="{}"> must be assigned wo `state.{}` and on native html elements -->
            <tr
              v-for="(scan, scanIndex) in state.scans.value"
              ref="tableRefs"
              :key="scan.pk"
              @click="state.scanOpen.value = scan; state.scanOpenIndex.value = scanIndex;"
              :data-is-selected="scan.pk === state.scanOpen.value?.pk"
              :data-is-viewed="scan.is_viewed"
              class="table-row"
            >
              <chakra.td pr="0 !important">
                {{ scan.donor_id }}
              </chakra.td>

              <chakra.td
                white-space="nowrap"
                v-if="scan.gift?.first_name"
                pr="0 !important"
                max-w="130px"
                overflow-x="hidden"
              >
                {{ scan.gift?.first_name }} {{ scan.gift?.last_name }}
              </chakra.td>
              <chakra.td v-else />

              <chakra.td data-is-numeric="true">${{ scan.amount }}</chakra.td>
              <chakra.td>
                <CBox
                  v-if="scan.is_duplicated"
                  px="1"
                  font-size="xs"
                  bg="teal.500"
                  color="white"
                  border-radius="md"
                >
                  Duplicate
                </CBox>
              </chakra.td>
            </tr>
          </chakra.tbody>
        </ChakraTable>
      </CFlex>

    </CFlex>

    <CFlex pos="relative" w="100%">
      <CFlex
        v-if="state.scanOpen.value"
        direction="row"
        pos="fixed"
        max-h="100%"
        overflow-y="auto"
        top="0"
        p="8"
        pt=""
        pl="4"
        gap="8"
      >
        <CFlex direction="column" max-w="800px" min-w="800px">
          <chakra.img :src="state.scanOpen.value.image_front" />
          <chakra.img :src="state.scanOpen.value.image_back" />
        </CFlex>

        <FiscGiftForm
          v-if="state.scanOpen.value.gift"
          :scan-open="state.scanOpen.value"
          :load-scans="loadScans"
        />
        <FiscOptOutForm
          v-else
          :scan-open="state.scanOpen.value"
          :load-scans="loadScans"
        />

      </CFlex>
    </CFlex>

  </CFlex>
</template>

<style lang="scss">
  .table-row {
    &:hover {
      background: var(--colors-gray-100);
      cursor: pointer;
    }
    &[data-is-selected=true] {
      background: var(--colors-gray-200);
    }
    &[data-is-viewed=false] {
      color: var(--colors-blue-500);
    }
  }
</style>
