<script setup lang="ts">
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { PortfolioPlan } from "~/apps/portfolios/interfaces";
  import { useApi } from "~/composables/useApi";
  import { ref } from "vue";
  import { debounce } from "vue-debounce";

  const props = defineProps<{ plan: PortfolioPlan; }>();

  const emit = defineEmits<{
    (event: "portfolioUpdated"): void;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    isOpen: ref(false),
    isLoadingDonors: ref(false),
    isAddingDonors: ref(false),
    donors: ref<CrmDonor[]>([]),
    donorsSelected: ref<CrmDonor[]>([]),
  };

  async function addDonors() {
    state.isAddingDonors.value = true;

    const res = await hooks.api.post(`/portfolios/${props.plan.id}/add-donors`, {
      donors: state.donorsSelected.value.map(donor => donor.id)
    });

    state.isAddingDonors.value = false;

    state.isOpen.value = false;
    emit("portfolioUpdated");

    if (res.data > 0) {
      hooks.notify.send(`${res.data} donors have been added to ${props.plan.name}`);

      await new Promise(resolve => setTimeout(resolve, 500));
      location.reload();
    } else {
      hooks.notify.send(`The selected donors already belong to another portfolio.`);
    }

    state.donorsSelected.value = [];
  }

  async function searchDonors(search: string) {
    state.isLoadingDonors.value = true;
    const res = await hooks.api.get(`/crms/donors/?name=${encodeURIComponent(search)}&limit=30&org_id=${props.plan.org_id}`);
    state.donors.value = res.data.filter(donor => !props.plan.donors.includes(donor.id));
    state.isLoadingDonors.value = false;
  }

  const searchDonorsDebounced = debounce(searchDonors, 500);
</script>

<template>
  <CFlex>
    <CButton
      @click="state.isOpen.value = true"
      gap="2"
      variant="outline"
      color-scheme="gray"
    >
      <CIcon name="plus" color="gray.500" />
      Add donors
    </CButton>

    <ChakraDrawer
      v-if="props.plan"
      v-model="state.isOpen.value"
      w="2xl"
    >
      <CFlex p="6" direction="column" gap="6">

        <CHeading size="lg" color="gray.600">Add donors</CHeading>

        <VueMultiselect
          v-model="state.donorsSelected.value"
          id="id"
          :autofocus="true"
          :multiple="true"
          :options="state.donors.value"
          :loading="state.isLoadingDonors.value"
          :disabled="state.isAddingDonors.value"
          :allow-empty="false"
          :searchable="true"
          @search-change="searchDonorsDebounced"
          placeholder="Type name to search"
          :custom-label="donor => `${donor.name} - \$${donor.donated_total}`"
        >
          <template #noResult>
            No donors found.
          </template>
          <template #noOptions>
            <CText color="gray.500" font-size="sm">Nothing typed yet</CText>
          </template>
        </VueMultiselect>

        <CButton
          @click="addDonors"
          :is-loading="state.isAddingDonors.value"
          w="fit-content"
        >
          Add to portfolio
        </CButton>

      </CFlex>
    </ChakraDrawer>
  </CFlex>
</template>
