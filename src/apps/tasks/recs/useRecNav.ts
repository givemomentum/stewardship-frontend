import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
import { useNotify } from "~/composables/useNotify";
import { urls } from "~/urls";

const hooks = {
  taskListStore: useTaskListStore(),
  api: useApi(),
  notify: useNotify(),
};

const comp = {
  task: computed(() => hooks.taskListStore.taskOpened.value),
  recNext: computed(() => {
    if (hooks.taskListStore.taskOpened.value?.rec_set.recs) {
      return hooks.taskListStore.taskOpened.value.rec_set.recs[hooks.taskListStore.recOpenedIndex.value + 1]
    }
  }),
  recPrev: computed(() => {
    if (hooks.taskListStore.taskOpened.value?.rec_set.recs) {
      return hooks.taskListStore.taskOpened.value.rec_set.recs[hooks.taskListStore.recOpenedIndex.value - 1]
    }
  }),
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
    returnToTaskIfHandledAll: async () => {
      const task = hooks.taskListStore.taskOpened.value;
      const incompleteRecs = task.rec_set.recs.filter(rec => rec.state === "new");
      if (incompleteRecs.length === 0) {
        const taskSkipped = task.rec_set.recs.filter(rec => rec.state.startsWith("skipped"));
        const isAllSkipped = taskSkipped.length === task.rec_set.recs.length;

        if (isAllSkipped) {
          await hooks.api.patch(`/tasks/${task.slug}/`, { status: "declined" });
          // todo does this affect the tasks list?
          hooks.taskListStore.taskOpened.value.status = "declined";
          hooks.notify.send("Task skipped");
          navigateTo(urls.tasks.detail(task.slug));
        } else {
          await hooks.api.patch(`/tasks/${task.slug}/`, { status: "completed" });
          hooks.taskListStore.taskOpened.value.status = "completed";
          hooks.notify.send("Task completed!");
          navigateTo(urls.tasks.detail(task.slug));
        }
      }
    }
  }
}
