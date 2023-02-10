<script lang="ts" setup>
  import { Recommendation, RecState } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useNotify } from "~/composables/useNotify";

  const props = defineProps<{
    rec: Recommendation;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    taskListStore: useTaskListStore(),
  };

  const state = {
    isSubmitting: ref(false),
  };
  
  async function skipRec(recState: RecState) {
    state.isSubmitting.value = true;
    await hooks.api.patch(`recs/${props.rec.pk}/`, {
      state: recState
    });
    hooks.taskListStore.recOpened.value.state = recState;
    state.isSubmitting.value = false;
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
          Already handled
        </CButton>
        
        <CButton
          @click="skipRec('skipped_to_next_month')"
          variant="outline"
          color-scheme="gray"
          bg="white"
          left-icon="bi-clock"
        >
          Move to next month
        </CButton>
        <CButton
          @click="skipRec('skipped_to_next_quarter')"
          variant="outline"
          color-scheme="gray"
          bg="white"
          left-icon="bi-clock"
        >
          Move to next quarter
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
