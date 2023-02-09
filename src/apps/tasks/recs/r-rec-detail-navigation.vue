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
<!--    <CButton-->
<!--      key="2"-->
<!--      px="3"-->
<!--      variant="outline"-->
<!--    >-->
<!--      <CIcon name="list" fill="white" size="6" />-->
<!--    </CButton>-->

    <NuxtLink
      :to="comp.recPrev.value ? urls.tasks.detailRec(props.task?.slug, comp.recPrev.value?.pk, comp.recPrev.value?.slug) : ''"
      :prefetch="true"
    >
      <CButton
        left-icon="bi-caret-left-fill"
        variant="outline"
        fill="blue.500"
        :disabled="!comp.recPrev.value"
        pl="3"
      >
        Previous
      </CButton>
    </NuxtLink>

    <CFlex font-weight="bold" font-size="xl" color="gray.500">
      {{ (hooks.taskListStore.recOpenedIndex?.value ?? 0) + 1 }} /
      {{ props.task?.rec_set?.recs.length }}
    </CFlex>

    <NuxtLink
      :to="comp.recNext.value ?
        urls.tasks.detailRec(props.task?.slug, comp.recNext.value?.pk, comp.recNext.value?.slug)
        : ''
      "
      :prefetch="true"
    >
      <CButton
        right-icon="bi-caret-right-fill"
        variant="outline"
        fill="blue.500"
        :disabled="!comp.recNext.value"
        pr="3"
      >
        Next
      </CButton>
    </NuxtLink>
  </CFlex>
</template>
