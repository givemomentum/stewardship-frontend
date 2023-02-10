import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
import { useComp } from "~/structs";
import { urls } from "~/urls";

const hooks = {
  taskListStore: useTaskListStore(),
};

const comp = useComp(() => {
  const rec = hooks.taskListStore.recOpened;
  return {
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
});

export function useRecStatus() {
  return {
    ...comp,
  }
}
