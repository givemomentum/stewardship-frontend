<script lang="ts" setup>
  import { useNotify } from "~/composables/useNotify";
  import { urls } from "~/urls";

  const props = defineProps<{
    recId: string | number;
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
    await hooks.api.post(`/portfolios/recs/${props.recId}/log-call`, {
      description: state.description.value,
      comm_pref: state.commPref.value,
    });
    hooks.notify.send(`Call logged for ${state.rec.value.donor.name}`);
    state.isSubmitting.value = false;
    navigateTo(urls.portfolios.portfolios);
  }
</script>

<template>
  <CBox w="100%">
    <PNavbar />

    <CFlex
      w="100%"
      p="6"
      bg="gray.50"
    >
      <CFlex key="3" gap="3" direction="column">
        <CHeading size="md">Log call for {{state.rec.value?.donor?.name}}</CHeading>
        <CFlex gap="3" direction="column" min-w="500px">
          <CTextarea
            placeholder="Description"
            :disabled="state.isSubmitting.value"
            v-model="state.description.value"
          />
          <CCheckbox
            @click="state.commPref.value = $event.target.checked ? 'call' : 'default'"
          >
            Prefers to be called
          </CCheckbox>
          <CButton
            @click="logCall()"
            :is-loading="state.isSubmitting.value"
            w="fit-content"
          >
            Log
          </CButton>
        </CFlex>
      </CFlex>
    </CFlex>
  </CBox>
</template>
