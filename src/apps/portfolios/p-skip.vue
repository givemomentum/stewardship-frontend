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
    const res = await hooks.api.get(`portfolios/recs/${props.recId}/`);
    if (res.data) {
      state.rec.value = res.data;
    }
  });

  async function skipRec(status: string) {
    state.isSubmitting.value = true;
    await hooks.api.patch(`portfolios/recs/${props.recId}/`, {
      status: status,
    });
    hooks.notify.send(`Recommendation for ${state.rec.value.donor.name} skipped`);
    state.isSubmitting.value = false;
    navigateTo(urls.portfolios.portfolios);
  }
</script>

<template>
  <CBox w="100%">
    <CFlex
      w="100%"
      h="auto"
      p="6"
      py="4"
      color="blue.100"
      bg="blue.800"
      font-size="lg"
    >
      <CFlex pl="1" gap="4" align="center">
        <NuxtLink :to="urls.tasks.list">
          <chakra.img src="/momentum-logo.svg" color="white" max-w="185px" />
        </NuxtLink>

        <VTooltip>
          <div>
            <CBox
              mt="6px"
              px="10px"
              pt="1px"
              pb="2px"
              bg="blue.100"
              color="blue.900"
              border-radius="lg"
              font-size="xs"
              :_hover="{cursor: 'help'}"
            >
              EAP
            </CBox>
          </div>

          <template v-slot:popper>
            <CText font-size="xs">Early Access Preview</CText>
          </template>
        </VTooltip>
      </CFlex>
    </CFlex>

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
