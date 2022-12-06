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
  }

  async function loadTaskGiftsHistory(taskRaw: Task) {
    const taskModifiable = getTaskModifiable(taskRaw);
    const promises = [];
    for (const rec of taskModifiable?.rec_set?.recs ?? []) {
      if (rec.donor) {
        const promise = hooks.api
          .get(`/crms/gifts/?donor=${rec.donor.pk}`)
          .then(res => {
            rec.donor.gifts = res.data;
          });
        promises.push(promise);
      }
    }
    await Promise.all(promises);
  }

  async function updateRecommendationCompletedStatus(rec: Recommendation) {
    await hooks.api.patch(`/recs/${rec.pk}/`, { is_completed: rec.is_completed, state: rec.state });
  }

  async function logAction(rec: Recommendation, action: string) {
    await hooks.api.patch(`/recs/${rec.pk}/`, {
      action_description: rec.action_description,
      action_type: rec.action_type,
      action_state: rec.action_state,
    });
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
    loadTaskGiftsHistory: loadTaskGiftsHistory,
    updateRecommendationCompletedStatus: updateRecommendationCompletedStatus,
  };
}
