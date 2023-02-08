import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import { Recommendation, RecommendationSet, Task } from "~/apps/tasks/interfaces";

const state = {
  tasks: ref<Task[]>([]),
  taskOpened: ref<Task | null>(null),
  recOpened: ref<Recommendation | null>(null),
  isRecsLoaded: ref<boolean>(false),
  isGiftHistoryLoaded: ref<boolean>(false),
};

const comp = {
  recOpenedIndex: computed(
    () => state.taskOpened.value?.rec_set?.recs?.findIndex(
      rec => rec.pk === state.recOpened.value?.pk,
    ),
  ),
};

export function useTaskListStore() {
  const hooks = {
    api: useApi(),
  };

  async function loadTasks(args?: { paramsInitial?: string[]; isShowAllTasks?: boolean; isPublishedOnly?: boolean }) {
    let path = "/tasks/";
    const params = args?.paramsInitial ?? [];
    if (args?.isPublishedOnly) {
      params.push("is_published=true");
    }
    if (!args?.isShowAllTasks) {
      params.push("status=recommended");
    }
    if (params.length > 0) {
      path += `?${params.join("&")}`;
    }

    const res = await hooks.api.get(path);
    if (res.data) {
      sortRecsForAllTasks(res.data);
    }
    state.tasks.value = res.data ?? [];
  }

  async function loadTaskListAndRecs(args?: { isShowAllTasks?: boolean; isPublishedOnly?: boolean }) {
    await loadTasks({ paramsInitial: ["expand=rec_set"], ...args });
    state.taskOpened.value = state.tasks.value.find(task => task.pk === state.taskOpened.value?.pk) ?? null;
    state.isRecsLoaded.value = true;
  }

  async function loadTaskOpenedRecsAndGiftHistory() {
    if (state.taskOpened.value.rec_set) {
      const res = await hooks.api.get(
        `/rec-sets/${state.taskOpened.value.rec_set.pk}/?expand=recs.email,recs.donor.gifts`,
      );
      if (res.data) {
        sortRecs(res.data);
        state.taskOpened.value.rec_set = res.data;
      }
    }
    state.isGiftHistoryLoaded.value = true;
  }

  async function updateRecState(rec: Recommendation) {
    await hooks.api.patch(`/recs/${rec.pk}/`, { state: rec.state });
  }

  async function fetchDonorAction(rec: Recommendation) {
    const res = await hooks.api.get(`crms/actions/?donor=${rec.donor.pk}`);
    if (res.data) {
      rec.donor.actions = res.data;
    }
  }

  async function setRecFollowUp(rec: Recommendation, isFollowUpNeeded: boolean) {
    await hooks.api.patch(`/recs/${rec.pk}/`, { is_follow_up_needed: isFollowUpNeeded });
  }

  function sortRecsForAllTasks(tasks: Task[]) {
    for (const task of tasks) {
      if (task.rec_set) {
        sortRecs(task.rec_set);
      }
    }
  }

  function sortRecs(rec_set: RecommendationSet) {
    if (!rec_set.recs) {
      return;
    }

    switch (rec_set.rule?.order_recs_by) {
      case "id_ascending":
        rec_set.recs.sort((a, b) => a.pk - b.pk);
        break;
      case "score_descending":
        rec_set.recs.sort((a, b) => b.score - a.score);
        break;
    }
  }

  return {
    tasks: state.tasks,
    taskOpened: state.taskOpened,
    recOpened: state.recOpened,
    isRecsLoaded: state.isRecsLoaded,
    isGiftHistoryLoaded: state.isGiftHistoryLoaded,
    recOpenedIndex: comp.recOpenedIndex,
    loadTasks: loadTasks,
    loadTaskListAndRecs: loadTaskListAndRecs,
    loadTaskOpenedRecsAndGiftHistory: loadTaskOpenedRecsAndGiftHistory,
    updateRecState: updateRecState,
    setRecFollowUp: setRecFollowUp,
    fetchDonorAction: fetchDonorAction,
  };
}
