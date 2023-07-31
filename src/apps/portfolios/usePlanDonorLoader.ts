import { Ref } from "vue";
import { PrimaryKey } from "~/apps/auth/interfaces";
import { CrmDonor, DonorProfileSection } from "~/apps/letters/interfaces";
import { PortfolioPlan } from "~/apps/portfolios/interfaces";

const state = {
  donorPromises: ref({} as Record<string, Promise<CrmDonor | null>>),
  planPromises: ref({} as Record<string, Promise<PortfolioPlan | null>>),
  donorProfilePromises: ref({} as Record<string, Promise<DonorProfileSection[] | null>>),
  donor: ref(null as CrmDonor | null),
  donorProfile: ref([] as DonorProfileSection[]),
  plan: ref(null as PortfolioPlan | null),
};

const hooks = {
  api: useApi(),
};

export function usePlanDonorLoader(donorId: PrimaryKey, planId?: PrimaryKey): {
  donor: Ref<CrmDonor | null>,
  plan: Ref<PortfolioPlan | null>,
  donorProfile: Ref<DonorProfileSection[]>,
} {
  watch(() => donorId, async () => {
    const isNewDonor = !state.donorPromises.value[donorId];
    if (isNewDonor) {
      if (!planId) {
        throw new Error('planId is required');
      }
      state.donorPromises.value[donorId] = hooks.api.getJson(`/crms/donors/${donorId}/`);
      state.planPromises.value[planId] = hooks.api.getJson(`/portfolios/portfolios/${planId}/`);

      state.donorProfilePromises.value[donorId] = hooks.api.getJson(`/donor-profiles/${donorId}`);
    }

    state.donor.value = await state.donorPromises.value[donorId];
    state.donorProfile.value = await state.donorProfilePromises.value[donorId];
    if (planId ?? state.plan.value?.id) {
      state.plan.value = await state.planPromises.value[planId ?? state.plan.value.id];
    }
  }, { immediate: true });

  return {
    donor: state.donor,
    plan: state.plan,
    donorProfile: state.donorProfile,
  }
}
