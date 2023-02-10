import { useTaskListStore } from "~/apps/tasks/useTaskListStore";

const hooks = {
  taskListStore: useTaskListStore(),
};

export function useRecStatus() {
  const rec = hooks.taskListStore.recOpened;
  return {
    isNew: computed(() => rec.value?.state === "new"),
    isHandled: computed(() => rec.value?.state !== "new"),
    isCompleted: computed(() => rec.value?.state === "completed"),
    isSkipped: computed(() => rec.value?.state === "dismissed" || rec.value?.state.startsWith("skipped")),
    isSkippedToLater: computed(() => rec.value?.state.startsWith("skipped_to")),
    isSkippedAsHandled: computed(() => rec.value?.state === "skipped_as_already_handled"),
    isSkippedToNextMonth: computed(() => rec.value?.state === "skipped_to_next_month"),
    isSkippedToNextQuarter: computed(() => rec.value?.state === "skipped_to_next_quarter"),
    isSkippedAsUnqualified: computed(() => {
      return rec.value?.state === "skipped_as_unqualified" || rec.value?.state === "dismissed";
    }),

    actionTypeLabel: computed(() => {
      if (rec.value?.action_type === 'other' || rec.value?.action_type === 'none') {
        return "";
      }
      return rec.value?.action_type;
    }),
  };
}
