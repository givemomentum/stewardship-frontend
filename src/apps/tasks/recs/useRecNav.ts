import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
import { useNotify } from "~/composables/useNotify";
import { urls } from "~/urls";

const hooks = {
  tasks: useTaskListStore(),
  api: useApi(),
  notify: useNotify(),
};

const comp = {
  task: computed(() => hooks.tasks.taskOpened.value),
  recNext: computed(() => {
    if (hooks.tasks.taskOpened.value?.rec_set.recs) {
      return hooks.tasks.taskOpened.value.rec_set.recs[hooks.tasks.recOpenedIndex.value + 1];
    }
  }),
  recPrev: computed(() => {
    if (hooks.tasks.taskOpened.value?.rec_set.recs) {
      return hooks.tasks.taskOpened.value.rec_set.recs[hooks.tasks.recOpenedIndex.value - 1];
    }
  }),
};

export function useRecNav() {
  return {
    recNext: comp.recNext,
    recPrev: comp.recPrev,
    recNextUrl: computed(() => urls.tasks.detailRec(comp.task.value?.slug, comp.recNext.value?.slug)),
    recPrevUrl: computed(() => urls.tasks.detailRec(comp.task.value?.slug, comp.recPrev.value?.slug)),
    navigateToRecNext: async () => {
      const isAllHandled = comp.task.value.rec_set.recs.filter(rec => rec.state === "new").length == 0;
      if (isAllHandled) {
        await returnToTaskIfHandledAll();
      } else if (comp.recNext.value) {
        return navigateTo(
          urls.tasks.detailRec(comp.task.value?.slug, comp.recNext.value?.slug),
        );
      } else {
        const recNext = comp.task.value.rec_set.recs.filter(rec => rec.state === "new")[0];
        return navigateTo(
          urls.tasks.detailRec(comp.task.value?.slug, recNext.slug),
        );
      }
    },
    returnToTaskIfHandledAll: returnToTaskIfHandledAll,
  };
}

async function returnToTaskIfHandledAll() {
  const task = hooks.tasks.taskOpened.value;
  const incompleteRecs = task.rec_set.recs.filter(rec => rec.state === "new");
  if (incompleteRecs.length === 0) {
    const taskSkipped = task.rec_set.recs.filter(rec => rec.state.startsWith("skipped"));
    const isAllSkipped = taskSkipped.length === task.rec_set.recs.length;

    if (isAllSkipped) {
      await hooks.api.patch(`/tasks/${task.slug}/`, { status: "declined" });
      hooks.tasks.taskOpened.value.status = "declined";
      hooks.notify.send("Task skipped");
      navigateTo(urls.tasks.list);
    } else {
      await hooks.api.patch(`/tasks/${task.slug}/`, { status: "completed" });
      hooks.tasks.taskOpened.value.status = "completed";
      hooks.notify.send("Task completed!");
      navigateTo(urls.tasks.list);
    }
  }
}
