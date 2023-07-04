<script lang="ts" setup>
  import { TouchRec, TouchStatus } from "~/apps/portfolios/interfaces";
  import { useRecNav } from "~/apps/tasks/recs/useRecNav";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useNotify } from "~/composables/useNotify";
  import { urls } from "~/urls";

  const props = defineProps<{
    rec: TouchRec;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    tasks: useTaskListStore(),
    nav: useRecNav(),
  };

  const state = {
    isSubmitting: ref(false),
  };

  async function skipRec(status: TouchStatus) {
    state.isSubmitting.value = true;
    await hooks.api.patch(`/portfolios/recs/${props.rec.id}/`, {
      status: status,
    });
    hooks.notify.send(`Recommendation for ${props.rec.donor.name} skipped`);
    state.isSubmitting.value = false;

    navigateTo(urls.portfolios.donor(props.rec.plan.id, props.rec.donor.id));
  }
</script>

<template>
  <VDropdown
    :showTriggers="['click']"
  >
    <div>
      <CButton
        variant="outline"
        color-scheme="gray"
        :is-loading="state.isSubmitting.value"
        size="lg"
      >
        Skip
      </CButton>
    </div>

    <template #popper="popperProps">
      <CFlex p="3" direction="column" gap="3" bg="gray.50">
        <div>Select the reason:</div>
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
    </template>
  </VDropdown>

</template>
