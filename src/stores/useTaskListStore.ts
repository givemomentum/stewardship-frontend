import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import { Task } from "~/interfaces";

const state = {
  tasks: ref<Task[]>([]),
};

export function useTaskListStore() {
  const hooks = {
    api: useApi(),
  };

  async function loadTasks() {
    const res = await hooks.api.$get("/tasks/");
    state.tasks.value = res.data ?? [];
  }

  return {
    tasks: state.tasks,
    loadTasks: loadTasks,
  };
}
