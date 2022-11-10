import { ref } from "vue";
import { CrmGift } from "~/apps/letters/interfaces";
import { useApi } from "~/composables/useApi";
import { Task } from "~/apps/tasks/interfaces";

const state = {
  tasks: ref<Task[]>([]),
  taskOpened: ref<Task | null>(null),
};

export function useTaskListStore() {
  const hooks = {
    api: useApi(),
  };

  async function loadTasks() {
    const res = await hooks.api.$get("/tasks/");
    state.tasks.value = res.data ?? [];
  }

  async function loadTaskGifts() {
    const res = await hooks.api.$get("/tasks/?expand=gifts.donor");
    state.tasks.value = res.data ?? [];
  }

  async function loadTaskGiftsHistory(taskRaw: Task) {
    const taskModifiable = getTaskModifiable(taskRaw);
    const promises = [];
    for (const gift of taskModifiable?.gifts ?? []) {
      const promise = hooks.api
        .$get(`/crms/gifts/?donor=${gift.donor.pk}`)
        .then(res => {
            gift.donor.gifts = res.data;
        });
      promises.push(promise);
    }
    await Promise.all(promises);
  }

  async function toggleGiftTaskCompletion(taskRaw: Task, giftRaw: CrmGift, isCompleted: boolean) {
    const taskModifiable = getTaskModifiable(taskRaw);
    const giftTask = taskModifiable.gift_tasks.find(gift_task => gift_task.gift === giftRaw.pk)!;
    await hooks.api.$patch(`/tasks/task-gifts/${giftTask.pk}/`, { is_completed: isCompleted });
    giftTask.is_completed = isCompleted;
    // vue change detection triggers only on whole array updates, not attributes
    taskModifiable.gift_tasks = [...taskModifiable.gift_tasks];
  }

  function getTaskModifiable(taskRaw: Task): Task {
    // make sure it's the monitored Proxy object, and not a Props arg
    return state.tasks.value.find(task => task.pk === taskRaw.pk);
  }

  return {
    tasks: state.tasks,
    taskOpened: state.taskOpened,
    loadTasks: loadTasks,
    loadTaskGifts: loadTaskGifts,
    loadTaskGiftsHistory: loadTaskGiftsHistory,
    markGiftTaskCompleted: toggleGiftTaskCompletion,
  };
}
