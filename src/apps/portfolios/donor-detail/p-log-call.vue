<script lang="ts" setup>
import { useNotify } from "~/composables/useNotify";
import { urls } from "~/urls";

const props = defineProps<{
  recId?: string | number;
  donorId?: string | number;
  planId?: string | number;
  hideHeader?: boolean;
  onClose?: () => void;
}>();

const hooks = {
  api: useApi(),
  notify: useNotify(),
  layout: useLayoutControl(),
};

const state = {
  isSubmitting: ref(false),
  rec: ref(null),

  description: ref(""),
  commPref: ref("default"),
};

onBeforeMount(async () => {
  hooks.layout.activateLeanMode();
  const res = await hooks.api.get(`portfolios/recs/${props.recId}/`);
  state.rec.value = res.data;
});

async function logCall() {
  state.isSubmitting.value = true;
  if (props.recId) {
    await hooks.api.post(`/portfolios/recs/${props.recId}/log-call`, {
      description: state.description.value,
      comm_pref: state.commPref.value,
    });
    hooks.notify.send(`Call logged for ${state.rec.value.donor.name}`);
    state.isSubmitting.value = false;
    navigateTo(urls.portfolios.portfolios);
  } else if (props.planId) {
    await hooks.api.post(
      `/portfolios/${props.planId}/${props.donorId}/log-call`,
      {
        description: state.description.value,
        comm_pref: state.commPref.value,
      }
    );
    hooks.notify.send(`Call Logged`);
    if (props.onClose) props.onClose();
  }
}
</script>

<template>
  <CBox w="100%">
    <CBox v-if="!props.hideHeader">
      <PNavbar />
    </CBox>

    <CFlex w="100%" p="6" bg="white">
      <CFlex key="3" gap="3" direction="column">
        <CHeading size="md"
          >Log call for {{ state.rec.value?.donor?.name }}</CHeading
        >
        <CFlex gap="3" direction="column" min-w="500px">
          <CTextarea
            placeholder="Description"
            :disabled="state.isSubmitting.value"
            v-model="state.description.value"
          />
          <CCheckbox
            @click="
              state.commPref.value = $event.target.checked ? 'call' : 'default'
            "
            :disabled="state.isSubmitting.value"
            :checked="state.commPref.value.valueOf() === 'call'"
          >
            Prefers to be called
          </CCheckbox>
          <CFlex>
            <CButton
              @click="logCall()"
              :is-loading="state.isSubmitting.value"
              w="fit-content"
            >
              Log
            </CButton>

            <CButton
              v-if="props.onClose"
              @click="props.onClose()"
              :is-loading="state.isSubmitting.value"
              w="fit-content"
              ml="1"
              color-scheme="gray"
            >
              Cancel
            </CButton></CFlex
          >
        </CFlex>
      </CFlex>
    </CFlex>
  </CBox>
</template>
