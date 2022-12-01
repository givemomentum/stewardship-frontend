<script setup lang="ts">
  import { useRoute } from "#app";
  import { CFlex, chakra, CIcon, CBox } from "@chakra-ui/vue-next";
  import { onBeforeMount, onMounted, onUnmounted, ref, watch, Ref } from "vue";
  import MenuBreadcrumbs from "~/apps/menu/menu-breadcrumbs.vue";
  import { useApi } from "~/composables/useApi";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";
  import { FiscScan } from "~/apps/fisc/interfaces";
  import { urls } from "~/urls";
  import { toLocaleDateString } from "~/utils";

  const hooks = {
    route: useRoute(),
    api: useApi(),
    menu: useLeftMenu(),
  };

  type Order = 1 | 0 | -1;

  const state = {
    scans: ref<FiscScan[]>([]),
    scansUnsorted: ref<FiscScan[]>([]),
    scanOpenIndex: ref<number>(null),
    scanOpen: ref<FiscScan>(null),

    sortDonorId: ref<Order>(0),
    sortName: ref<Order>(0),
    sortAmount: ref<Order>(0),
  };

  const tableRefs = ref([]);

  onBeforeMount(() => {
    hooks.menu.collapse();
  });

  onMounted(async () => {
    await loadScans();
    document.addEventListener("keydown", handleKeyUp);
  });

  onUnmounted(() => {
    hooks.menu.unfold();
    document.removeEventListener("keydown", handleKeyUp);
  });

  watch(state.scanOpen, async scanNew => {
    if (!scanNew.is_viewed) {
      await hooks.api.patch(`/fisc/scans/${scanNew.pk}/`, { is_viewed: true });
      scanNew.is_viewed = true;
    }
  });

  watch(state.sortName, (orderNew: Order) => {
    if (orderNew === 0) {
      state.scans.value = [...state.scansUnsorted.value];
      return;
    }
    state.scans.value = state.scans.value.sort((a, b) => {
      const nameA = a.gift?.first_name?.toLowerCase();
      const nameB = b.gift?.first_name?.toLowerCase();
      if (nameA < nameB) {
        return orderNew === 1 ? -1 : 1;
      }
      if (nameA > nameB) {
        return orderNew === 1 ? 1 : -1;
      }
      return 0;
    });
  });

  watch(state.sortDonorId, (orderNew: Order) => {
    if (orderNew === 0) {
      state.scans.value = [...state.scansUnsorted.value];
      return;
    }
    if (orderNew === 1) {
      state.scans.value = state.scans.value.sort((a, b) => a.donor_id - b.donor_id);
    } else {
      state.scans.value = state.scans.value.sort((a, b) => b.donor_id - a.donor_id);
    }
  });

  watch(state.sortAmount, (orderNew: Order) => {
    if (orderNew === 0) {
      state.scans.value = [...state.scansUnsorted.value];
      return;
    }
    if (orderNew === 1) {
      state.scans.value = state.scans.value.sort((a, b) => Number(a.amount) - Number(b.amount));
    } else if (orderNew === -1) {
      state.scans.value = state.scans.value.sort((a, b) => Number(b.amount) - Number(a.amount));
    }
  });

  function toggleSorting(ref: Ref<Order>) {
    if (ref.value === 1) {
      ref.value = -1;
    } else if (ref.value === -1) {
      ref.value = 0;
    } else {
      ref.value = 1;
    }
  }

  async function loadScans() {
    const res = await hooks.api.get(`/fisc/scans/?date=${hooks.route.params.date}`);
    state.scans.value = res.data;
    state.scansUnsorted.value = [...res.data];
    if (state.scanOpenIndex.value) {
      state.scanOpen.value = state.scans.value[state.scanOpenIndex.value];
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    const isEditingInputTextWithArrows = (event.target as any).tagName === "INPUT";
    if (isEditingInputTextWithArrows) {
      return;
    }

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

      const isRefPosNotCorruptedBySorting = !state.sortDonorId.value && !state.sortName.value && !state.sortAmount.value;
      if (isRefPosNotCorruptedBySorting) {
        // doesn't work wo setTimeout, prob a Vue render issue
        setTimeout(() => {
          tableRefs.value[scanIndexNew].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 0);
      }
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
            label: toLocaleDateString($route.params.date),
            isCurrentPage: true,
          },
          { label: 'Scans', isCurrentPage: true },
        ]"
      />

      <CFlex h="fit-content">
        <ChakraTable size="sm" min-w="370px" mt="8" class="fisc-table">
          <chakra.thead>
            <chakra.tr>
              <chakra.th
                @click="toggleSorting(state.sortDonorId)"
                pos="relative"
                :_hover="{ cursor: 'pointer' }"
              >
                Donor ID
                <CIcon top="11px" right="2" pos="absolute" v-if="state.sortDonorId.value === -1" name="chevron-up" />
                <CIcon top="11px" right="2" pos="absolute" v-if="state.sortDonorId.value === 1" name="chevron-down" />
              </chakra.th>

              <chakra.th
                @click="toggleSorting(state.sortName)"
                pos="relative"
                :_hover="{ cursor: 'pointer' }"
              >
                Name
                <CIcon top="11px" right="16" pos="absolute" v-if="state.sortName.value === -1" name="chevron-up" />
                <CIcon top="11px" right="16" pos="absolute" v-if="state.sortName.value === 1" name="chevron-down" />
              </chakra.th>

              <chakra.th
                data-is-numeric="true"
                @click="toggleSorting(state.sortAmount)"
                pos="relative"
                :_hover="{ cursor: 'pointer' }"
              >
                Amount
                <CIcon top="11px" right="px" pos="absolute" v-if="state.sortAmount.value === -1" name="chevron-up" />
                <CIcon top="11px" right="px" pos="absolute" v-if="state.sortAmount.value === 1" name="chevron-down" />
              </chakra.th>

              <chakra.th>Duplicate</chakra.th>
            </chakra.tr>
          </chakra.thead>

          <chakra.tbody>
            <!-- <tr ref="{}"> must be assigned wo `state.{}` and on a native html elements -->
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

              <chakra.td data-is-numeric="true">
                ${{ scan.amount }}
              </chakra.td>

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
        top="0"
        p="8"
        pl="4"
        gap="8"
      >
        <CFlex
          direction="column"
          max-w="800px"
          min-w="800px"
          pos="fixed"
          pb="16"
          h="100%"
          overflow-y="auto"
          z-index="1"
        >
          <chakra.img :src="state.scanOpen.value.image_front" />
          <chakra.img :src="state.scanOpen.value.image_back" />
        </CFlex>

        <CFlex pl="832px" pos="fixed">
          <FiscGiftForm
            v-if="state.scanOpen.value.gift"
            :scan-open="state.scanOpen.value"
            :load-scans="loadScans"
          />
          <FiscExistingDonorNoGift
            v-else-if="state.scanOpen.value.is_existing_donor"
            :scan-open="state.scanOpen.value"
          />
          <FiscOptOutForm
            v-else
            :scan-open="state.scanOpen.value"
            :load-scans="loadScans"
          />
        </CFlex>
      </CFlex>
    </CFlex>

  </CFlex>
</template>

<style lang="scss">
  .fisc-table {

    .table-row {
      &:hover {
        background: var(--colors-gray-100);
        cursor: pointer;
      }

      &[data-is-selected=true] {
        background: var(--colors-gray-200);
      }

      &[data-is-viewed=false] {
        color: var(--colors-blue-600);
      }
    }
  }
</style>
