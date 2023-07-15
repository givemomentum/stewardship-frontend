<script lang="ts" setup>
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { TouchRec } from "~/apps/portfolios/interfaces";
  import { useAlgolia } from "~/apps/portfolios/useAlgolia";
  import { useNotify } from "~/composables/useNotify";
  import { urls } from "~/urls";

  const props = defineProps<{
    donor: CrmDonor;
    rec?: TouchRec;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    algolia: useAlgolia(),
  };

  const state = {
    isSubmitting: ref(false),
    description: ref(""),
    commPref: ref("default"),
  };

  async function logCall() {
    state.isSubmitting.value = true;
    await hooks.api.post(`/portfolios/recs/${props.rec.id}/log-call`, {
      description: state.description.value,
      comm_pref: state.commPref.value,
    });
    state.description.value = "";
    state.isSubmitting.value = false;
    hooks.notify.send(`Call logged for ${props.rec.donor.name}`);

    // todo merge with p-form-skip that has the same code as below
    hooks.algolia.reloadPortfolio();

    const recPendingNext = await hooks.api.getJson(
      `/portfolios/${props.rec.plan.id}/rec-pending?donor_id_excluded=${props.rec.donor.id}`
    );
    if (recPendingNext) {
      return navigateTo(urls.portfolios.contactDonor(
        props.rec.plan.id,
        recPendingNext.donor.id,
        recPendingNext.id,
      ));
    }
    navigateTo(urls.portfolios.portfolio(props.rec.plan.id));
  }
</script>

<template>
  <CFlex gap="3" direction="column" min-w="500px">

    <CBox>
      <CFormLabel font-size="sm" color="gray.500">Notes</CFormLabel>
      <CTextarea
        placeholder="Call notes"
        :disabled="state.isSubmitting.value"
        v-model="state.description.value"
      />
    </CBox>
    <CCheckbox
      @click="state.commPref.value = $event.target.checked ? 'call' : 'default'"
      :disabled="state.isSubmitting.value"
      :checked="state.commPref.value.valueOf() === 'call'"
    >
      Prefers to be called
    </CCheckbox>

    <CFlex gap="4" direction="column" w="fit-content">
      <CButton
        @click="logCall()"
        :is-loading="state.isSubmitting.value"
        w="fit-content"
        size="lg"
      >
        Log
      </CButton>

      <PFormSkip
        v-if="props.rec"
        :rec="props.rec"
      />
    </CFlex>

  </CFlex>
</template>
