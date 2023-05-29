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
  };

  onBeforeMount(async () => {
    hooks.layout.activateLeanMode();
    const res = await hooks.api.get(`/portfolios/recs/${props.recId}/`);
    if (res.data) {
      state.rec.value = res.data;
    }
  });

  async function skipRec(status: string) {
    state.isSubmitting.value = true;
    await hooks.api.patch(`/portfolios/recs/${props.recId}/`, {
      status: status,
    });
    hooks.notify.send(`Recommendation for ${state.rec.value.donor.name} skipped`);
    state.isSubmitting.value = false;
    navigateTo(urls.portfolios.portfolios);
  }
</script>

<template>
  <CBox w="100%">
    <PNavbar />

    <CFlex
      w="100%"
      p="3"
      bg="gray.50"
      justify="center"
      h="100vh"
      align="center"
      key="4"
    >
      <CFlex key="3" gap="3" direction="column">
        <CHeading size="md">Select the reason</CHeading>
        <CFlex gap="3">
          <CButton
            @click="skipRec('skipped_as_already_handled')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            left-icon="check-circle"
          >
            Already contacted
          </CButton>

          <CButton
            @click="skipRec('skipped_to_next_month')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            left-icon="bi-clock"
          >
            Reach out next month
          </CButton>
          <CButton
            @click="skipRec('skipped_to_next_quarter')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            left-icon="bi-clock"
          >
            Reach out next quarter
          </CButton>
          <CButton
            @click="skipRec('skipped_as_unqualified')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            left-icon="x"
          >
            Unqualified
          </CButton>
        </CFlex>
      </CFlex>
    </CFlex>
  </CBox>
</template>
