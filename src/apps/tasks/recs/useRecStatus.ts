import { Rec } from "~/apps/tasks/interfaces";
import { useTaskListStore } from "~/apps/tasks/useTaskListStore";

const hooks = {
  tasks: useTaskListStore(),
};

export function useRecStatus() {
  const rec = hooks.tasks.recOpened;
  return {
    isNew: computed(() => status.isNew(rec.value)),
    isHandled: computed(() => status.isHandled(rec.value)),
    isCompleted: computed(() => status.isCompleted(rec.value)),
    isSkipped: computed(() => rec.value?.state === "dismissed" || rec.value?.state.startsWith("skipped")),
    isSkippedToLater: computed(() => status.isSkippedToLater(rec.value)),
    isSkippedAsHandled: computed(() => status.isSkippedAsHandled(rec.value)),
    isSkippedToNextMonth: computed(() => rec.value?.state === "skipped_to_next_month"),
    isSkippedToNextQuarter: computed(() => rec.value?.state === "skipped_to_next_quarter"),
    isSkippedAsUnqualified: computed(() => rec.value?.state === "skipped_as_unqualified" || rec.value?.state === "dismissed"),

    actionTypeLabel: computed(() => {
      if (rec.value?.action_type === "other" || rec.value?.action_type === "none") {
        return "";
      }
      return rec.value?.action_type;
    }),
  };
}

export namespace status {
  export const isNew = (rec?: Rec) => rec?.state === "new";
  export const isHandled = rec => !isNew(rec);
  export const isCompleted = (rec?: Rec) => rec?.state === "completed";
  export const isSkippedAsHandled = (rec?: Rec) => rec?.state === "skipped_as_already_handled";
  export const isSkippedToLater = (rec?: Rec) => rec?.state.startsWith("skipped_to");
  export const isSkippedAsUnqualified = (rec?: Rec) => rec?.state === "skipped_as_unqualified" || rec?.state === "dismissed";
}
