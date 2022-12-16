import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import { Recommendation, Task } from "~/apps/tasks/interfaces";

const state = {
  tasks: ref<Task[]>([]),
  taskOpened: ref<Task | null>(null),
};

export function useTaskListStore() {
  const hooks = {
    api: useApi(),
    route: useRoute(),
  };

  async function loadTasks() {
    let path = "/tasks/";
    if (!hooks.route.query.include_unpublished) {
      path += "?is_published=true";
    }
    const res = await hooks.api.get(path);
    state.tasks.value = res.data ?? [];
  }

  async function loadTaskRecommendations() {
    let path = "/tasks/?expand=rec_set";
    if (!hooks.route.query.include_unpublished) {
      path += "&is_published=true";
    }
    const res = await hooks.api.get(path);
    state.tasks.value = res.data ?? [];
    state.taskOpened.value = state.tasks.value.find(task => task.pk === state.taskOpened.value?.pk) ?? null;
  }

  async function loadGiftHistory(taskRaw: Task) {
    const taskModifiable = getTaskModifiable(taskRaw);
    if (taskModifiable.rec_set) {
      const res = await hooks.api.get(`/rec-sets/${taskModifiable.rec_set.pk}/?expand=recs.donor.gifts`);
      if (res.data) {
        taskModifiable.rec_set = res.data;
      }
    }
  }

  async function updateRecommendationState(rec: Recommendation) {
    await hooks.api.patch(`/recs/${rec.pk}/`, { state: rec.state });
  }

  function getTaskModifiable(taskRaw: Task): Task {
    // make sure it's the monitored Proxy object, and not a Props arg
    return state.tasks.value.find(task => task.pk === taskRaw.pk)!;
  }

  return {
    tasks: state.tasks,
    taskOpened: state.taskOpened,
    loadTasks: loadTasks,
    loadTaskRecommendations: loadTaskRecommendations,
    loadGiftHistory: loadGiftHistory,
    updateRecommendationState: updateRecommendationState,
  };
}
