import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import { Recommendation, RecommendationSet, Task } from "~/apps/tasks/interfaces";

const state = {
  tasks: ref<Task[]>([]),
  taskOpened: ref<Task | null>(null),
};

export function useTaskListStore() {
  const hooks = {
    api: useApi(),
    route: useRoute(),
  };

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

  function sortRecsForAllTasks(tasks: Task[]) {
    for (let task of tasks) {
      if (task.rec_set) {
        sortRecs(task.rec_set);
      }
    }
  }

  async function loadTasks() {
    let path = "/tasks/";
    if (!hooks.route.query.include_unpublished) {
      path += "?is_published=true";
    }
    const res = await hooks.api.get(path);
    if (res.data) {
      sortRecsForAllTasks(res.data);
    }
    state.tasks.value = res.data ?? [];
  }

  async function loadTaskRecs() {
    let path = "/tasks/?expand=rec_set";
    if (!hooks.route.query.include_unpublished) {
      path += "&is_published=true";
    }
    const res = await hooks.api.get(path);
    if (res.data) {
      sortRecsForAllTasks(res.data);
    }
    state.tasks.value = res.data ?? [];
    state.taskOpened.value = state.tasks.value.find(task => task.pk === state.taskOpened.value?.pk) ?? null;
  }

  async function loadRecsAndGiftHistory(taskRaw: Task) {
    const taskModifiable = getTaskModifiable(taskRaw);
    if (taskModifiable.rec_set) {
      const res = await hooks.api.get(`/rec-sets/${taskModifiable.rec_set.pk}/?expand=recs.donor.gifts`);
      if (res.data) {
        sortRecs(res.data)
        taskModifiable.rec_set = res.data;
      }
    }
  }

  async function updateRecState(rec: Recommendation) {
    await hooks.api.patch(`/recs/${rec.pk}/`, { state: rec.state });
  }

  async function setRecFollowUp(rec: Recommendation, isFollowUpNeeded: boolean) {
    await hooks.api.patch(`/recs/${rec.pk}/`, { is_follow_up_needed: isFollowUpNeeded });
  }

  function getTaskModifiable(taskRaw: Task): Task {
    // make sure it's the monitored Proxy object, and not a Props arg
    return state.tasks.value.find(task => task.pk === taskRaw.pk)!;
  }

  return {
    tasks: state.tasks,
    taskOpened: state.taskOpened,
    loadTasks: loadTasks,
    loadTaskRecs: loadTaskRecs,
    loadRecsAndGiftHistory: loadRecsAndGiftHistory,
    updateRecState: updateRecState,
    setRecFollowUp: setRecFollowUp,
  };
}
