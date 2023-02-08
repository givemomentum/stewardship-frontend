<script lang="ts" setup>
  import { Recommendation, Task } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { urls } from "~/urls";

  const props = defineProps<{
    task?: Task;
    rec?: Recommendation;
  }>();

  const hooks = {
    taskListStore: useTaskListStore(),
  };

  const comp = {
    recNext: computed(() => props.task?.rec_set.recs[hooks.taskListStore.recOpenedIndex.value + 1]),
    recPrev: computed(() => props.task?.rec_set.recs[hooks.taskListStore.recOpenedIndex.value - 1]),
  };
</script>

<template>
  <CFlex align="center" gap="3" v-if="comp.recPrev.value || comp.recNext.value">
    <NuxtLink :to="comp.recPrev.value ? urls.tasks.detailRec(props.task?.slug, comp.recPrev.value?.slug) : ''">
      <CButton
        left-icon="bi-caret-left-fill"
        variant="outline"
        fill="blue.500"
        :disabled="!comp.recPrev.value"
      >
        Previous
      </CButton>
    </NuxtLink>

    <CFlex font-weight="bold" font-size="xl">
      {{ (hooks.taskListStore.recOpenedIndex?.value ?? 0) + 1 }} /
      {{ props.task?.rec_set?.recs.length }}
    </CFlex>

    <NuxtLink :to="comp.recNext.value ? urls.tasks.detailRec(props.task?.slug, comp.recNext.value?.slug) : ''">
      <CButton
        right-icon="bi-caret-right-fill"
        variant="outline"
        fill="blue.500"
        :disabled="!comp.recNext.value"
      >
        Next
      </CButton>
    </NuxtLink>
  </CFlex>
</template>
