<script lang="ts" setup>
  import { TouchRec, TouchStatus } from "~/apps/portfolios/interfaces";
  import { useAlgolia } from "~/apps/portfolios/useAlgolia";
  import { useNotify } from "~/composables/useNotify";
  import { urls } from "~/urls";

  const props = defineProps<{
    rec: TouchRec;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    algolia: useAlgolia(),
  };

  const state = {
    isSubmitting: ref(false),
  };

  async function skipRec(status: TouchStatus) {
    state.isSubmitting.value = true;
    await hooks.api.patch(`/portfolios/recs/${props.rec.id}/`, {
      status: status,
    });
    state.isSubmitting.value = false;
    hooks.notify.send(`Recommendation for ${props.rec.donor.name} skipped`);

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

  <CPopover>
    <CPopoverTrigger>
      <CButton
        variant="outline"
        color-scheme="gray"
        :is-loading="state.isSubmitting.value"
        size="lg"
      >
        Skip
      </CButton>
    </CPopoverTrigger>
    <CPopoverContent w="fit-content">
      <CPopoverArrow />
      <CPopoverCloseButton mt="2" />
      <CPopoverBody p="0">
        <CFlex p="3" direction="column" gap="3" bg="gray.50">
          <div>Select the reason:</div>
          <CButton
            @click="skipRec('skipped_as_already_handled')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            :is-loading="state.isSubmitting.value"
            left-icon="check-circle"
          >
            Already contacted
          </CButton>

          <CButton
            @click="skipRec('skipped_to_next_month')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            :is-loading="state.isSubmitting.value"
            left-icon="bi-clock"
          >
            Reach out next month
          </CButton>
          <CButton
            @click="skipRec('skipped_to_next_quarter')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            :is-loading="state.isSubmitting.value"
            left-icon="bi-clock"
          >
            Reach out next quarter
          </CButton>
          <CButton
            @click="skipRec('skipped_as_unqualified')"
            variant="outline"
            color-scheme="gray"
            bg="white"
            :is-loading="state.isSubmitting.value"
            left-icon="x"
          >
            Unqualified
          </CButton>
        </CFlex>
      </CPopoverBody>
    </CPopoverContent>
  </CPopover>

</template>
