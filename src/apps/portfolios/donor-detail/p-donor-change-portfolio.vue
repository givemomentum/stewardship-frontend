<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<!-- eslint-disable vue/max-len -->
<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { useApi } from "~/composables/useApi";
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { PortfolioPlan } from "../interfaces";
  import { captureEvent } from "@sentry/hub";

  const isOpen = ref(false);

  async function togglePortfolio(targetPortfolioID: number) {
    const donorID = props.donor.id;
    const args = {
      donor_id: donorID,
      from_id: props.currentPlan.id,
      to_id: targetPortfolioID,
    };
    try {
      await hooks.api.post(`/crms/donors/change-portfolio`, args);
    } catch (e) {
      captureEvent(e);
    }
    hooks.algolia.reloadPortfolio()
    const newURL = `/portfolios/portfolio/${targetPortfolioID}/donor/${donorID}`;
    navigateTo(newURL);
  }
  const props = defineProps<{
    donor: CrmDonor;
    currentPlan: PortfolioPlan;
  }>();

  const hooks = {
    api: useApi(),
  };

  const state = {
    isOpen: ref(true),
    allPortfolios: ref<PortfolioPlan[]>([]),
  };

  watch(() => props.currentPlan, () => {
    hooks.api.get(`/portfolios/portfolios/`).then(res => {
      state.allPortfolios = res.data.filter(
        (plan: PortfolioPlan) => Number(plan.id) !== Number(props.currentPlan.id)
        ,
      );
    });
  });

</script>

<template>
  <div class="dropdown">
    <CButton
      class="dropdown-button"
      @click="isOpen = !isOpen"
      @keypress="isOpen = !isOpen"
      ml="1">
      {{props.currentPlan?.name}}
    </CButton>
    <ul
      class="dropdown-menu"
      v-show="isOpen"
      @keypress="isOpen = !isOpen"
      @click="isOpen = false">
      <li
        v-for="(option, index) in state.allPortfolios"
        :key="index"
        @click.stop="togglePortfolio(option?.id)"
        @keypress="isOpen = !isOpen">
        {{ option?.name || "" }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: #3498db;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown-menu {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  right: 0px;
  margin-top: 4px;
}

.dropdown-menu li {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-menu li:hover {
  background-color: #ddd;
}

.show {
  display: block;
}.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: #3498db;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
}

.dropdown-menu {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-menu li {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #ddd;
}

.dropdown-menu {
  display: block;
}
</style>
