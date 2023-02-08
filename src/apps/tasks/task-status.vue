<script lang="ts" setup>
  import { useApi } from "~/composables/useApi";
  import { DropdownOption, Task, TaskStatusStr } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import OptionSelect from "~/apps/shared/option-select.vue";

  const props = defineProps<{ task: Task }>();

  const hooks = {
    api: useApi(),
    taskListStore: useTaskListStore(),
  };

  const comp = {
    optionsAvailable: [
      getStatusDropdownOption("recommended"),
      getStatusDropdownOption("completed"),
      getStatusDropdownOption("declined"),
    ],
  };

  const state = {
    options: ref<DropdownOption<TaskStatusStr>[]>(comp.optionsAvailable),
  };

  watch(() => props.task.status, (statusNew: TaskStatusStr) => {
    state.options.value = comp.optionsAvailable.filter(option => option.value !== statusNew);
  }, { immediate: true });

  async function onSelected(optionNew: DropdownOption) {
    const res = await hooks.api.patch(
      `/tasks/${props.task.slug}/`,
      { status: optionNew.value },
    );
    if (hooks.taskListStore.taskOpened.value) {
      hooks.taskListStore.taskOpened.value.status = res.data.status;
    }
  }

  function getStatusDropdownOption(status: TaskStatusStr): DropdownOption<TaskStatusStr> {
    switch (status) {
    case "recommended":
      return { id: status, value: status, label: status.replace("_", " "), color: "teal.800", bg: "teal.100" };
    case "completed":
      return { id: status, value: status, label: status.replace("_", " "), color: "gray.800", bg: "gray.100" };
    case "declined":
      return { id: status, value: status, label: status.replace("_", " "), color: "blue.800", bg: "blue.100" };
    }
  }

</script>

<template>

  <OptionSelect
    :option-current="getStatusDropdownOption(props.task.status)"
    :options="state.options.value"
    :on-selected="onSelected"
  />

</template>
