import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
import { urls } from "~/urls";

const hooks = {
  taskListStore: useTaskListStore(),
};

const comp = {
  task: computed(() => hooks.taskListStore.taskOpened.value),
  recNext: computed(
    () => (
      hooks.taskListStore.taskOpened.value
      ?.rec_set
      .recs[hooks.taskListStore.recOpenedIndex.value + 1]
    )
  ),
  recPrev: computed(
    () => (
      hooks.taskListStore.taskOpened.value
      ?.rec_set
      .recs[hooks.taskListStore.recOpenedIndex.value - 1]
    )
  ),
};

export function useRecNav() {
  return {
    recNext: comp.recNext,
    recPrev: comp.recPrev,
    recNextUrl: computed(() => urls.tasks.detailRec(
      comp.task.value?.slug, comp.recNext.value?.pk, comp.recNext.value?.slug
    )),
    recPrevUrl: computed(() => urls.tasks.detailRec(
      comp.task.value?.slug, comp.recPrev.value?.pk, comp.recPrev.value?.slug
    )),
    navigateToRecNext: () => {
      if (!comp.recNext.value) {
        // todo success screen nav
        return;
      }
      navigateTo(
        urls.tasks.detailRec(
          comp.task.value?.slug,
          comp.recNext.value?.pk,
          comp.recNext.value?.slug
        )
      );
    },
  }
}
