import { ComputedRef } from "vue";
import { PrimaryKey } from "~/apps/auth/interfaces";
import { CrmDonor } from "~/apps/letters/interfaces";
import { PortfolioPlan } from "~/apps/portfolios/interfaces";

// gpt4 code

const state = {
  donorPromises: {} as Record<string, Promise<CrmDonor | null>>,
  planPromises: {} as Record<string, Promise<PortfolioPlan | null>>,
  donor: ref(null as CrmDonor | null),
  plan: ref(null as PortfolioPlan | null),
};

const hooks = {
  api: useApi(),
};

export function usePlanDonorLoader(donorId: PrimaryKey, planId: PrimaryKey): {
  donor: ComputedRef<CrmDonor>,
  plan: ComputedRef<PortfolioPlan>,
} {
  watch(() => donorId, async () => {
    const isNewDonor = !state.donorPromises[donorId];
    if (isNewDonor) {
      state.donorPromises[donorId] = hooks.api.getJson(`/crms/donors/${donorId}/`);
      state.planPromises[planId] = hooks.api.getJson(`/portfolios/portfolios/${planId}/`);
    }

    state.donor.value = await state.donorPromises[donorId];
    state.plan.value = await state.planPromises[planId];

  }, { immediate: true });

  return {
    donor: computed(() => state.donor.value),
    plan: computed(() => state.plan.value),
  }
}
