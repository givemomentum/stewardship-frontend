<script lang="ts" setup>
  import { useApi } from "~/composables/useApi";
  import { Task, TaskStatusStr, DropdownOption } from "~/interfaces";
  import { useTaskListStore } from "~/stores/useTaskListStore";
  import OptionSelect from "~/components/option-select";

  const props = defineProps<{ task: Task }>();

  const hooks = {
    api: useApi(),
    taskListStore: useTaskListStore(),
  };

  const comp = {
    options: [
      getStatusDropdownOption("pending"),
      getStatusDropdownOption("recommended"),
      getStatusDropdownOption("review"),
      getStatusDropdownOption("scheduled"),
      getStatusDropdownOption("in_progress"),
      getStatusDropdownOption("completed"),
      getStatusDropdownOption("failed"),
      getStatusDropdownOption("archived"),
    ] as DropdownOption<TaskStatusStr>[],
  };

  async function onSelected(optionNew: DropdownOption) {
    const res = await hooks.api.$patch(
      `/tasks/${props.task.slug}/`,
      { status: optionNew.value },
    );
    if (hooks.taskListStore.taskOpened.value) {
      hooks.taskListStore.taskOpened.value = res.data;
    }
    await hooks.taskListStore.loadTasks();
  }

  function getStatusDropdownOption(status: TaskStatusStr): DropdownOption<TaskStatusStr> {
    switch (status) {
      case "pending":
        return { id: status, value: status, label: status.replace("_", " "), color: "gray.800", bg: "gray.100" };
      case "recommended":
        return { id: status, value: status, label: status.replace("_", " "), color: "teal.800", bg: "teal.100" };
      case "review":
        return { id: status, value: status, label: status.replace("_", " "), color: "blue.800", bg: "blue.100" };
      case "scheduled":
        return { id: status, value: status, label: status.replace("_", " "), color: "green.800", bg: "green.100" };
      case "in_progress":
        return { id: status, value: status, label: status.replace("_", " "), color: "green.800", bg: "green.100" };
      case "completed":
        return { id: status, value: status, label: status.replace("_", " "), color: "gray.800", bg: "gray.100" };
      case "failed":
        return { id: status, value: status, label: status.replace("_", " "), color: "red.800", bg: "red.100" };
      case "archived":
        return { id: status, value: status, label: status.replace("_", " "), color: "red.800", bg: "red.100" };
      }
  }

</script>

<template>

  <OptionSelect
    :option-current="getStatusDropdownOption(props.task.status)"
    :options="comp.options"
    :on-selected="onSelected"
  />

</template>
