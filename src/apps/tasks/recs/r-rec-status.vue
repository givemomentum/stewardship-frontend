<script lang="ts" setup>
  import { useRecNav } from "~/apps/tasks/recs/useRecNav";
  import { useRecStatus } from "~/apps/tasks/recs/useRecStatus";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";

  const hooks = {
    taskListStore: useTaskListStore(),
    nav: useRecNav(),
    status: useRecStatus(),
  };
  
  const comp = {
    label: computed(() => {
      if (hooks.status.isCompleted.value) {
        return `Logged ${hooks.status.actionTypeLabel.value} to CRM`;
      }
      if (hooks.status.isSkippedToLater.value) {
        return `Skipped to later`;
      }
      if (hooks.status.isSkippedAsUnqualified.value) {
        return `Marked as unqualified`;
      }
      if (hooks.status.isSkippedAsHandled.value) {
        return `Skipped as already handled`;
      }
    }),
  }
</script>

<template>
  <CAlert
    variant="left-accent"
    :status="(hooks.status.isCompleted.value || hooks.status.isSkippedAsHandled.value) ? 'success' : 'info'"
    font-size="lg"
    pr="6"
    gap="2"
    :bg="hooks.status.isSkippedAsUnqualified.value ? 'gray.100' : 'var(--alert-bg)'"
    :border-color="hooks.status.isSkippedAsUnqualified.value ? 'gray.500' : 'var(--alert-fg)'"
  >
    <CIcon
      v-if="hooks.status.isSkippedAsHandled.value"
      name="check-circle-fill"
      size="6"
    />
    <CIcon
      v-if="hooks.status.isSkipped.value"
      name="bi-clock-fill"
      size="6"
      fill="blue.600"
    />
    <CAlertIcon v-if="!hooks.status.isSkippedAsHandled.value && !hooks.status.isSkipped.value" />
    {{ comp.label.value }}
  </CAlert>
</template>
