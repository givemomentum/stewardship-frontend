<script lang="ts" setup>
  import { Rec, Task } from "~/apps/tasks/interfaces";
  import { useRecNav } from "~/apps/tasks/recs/useRecNav";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { urls } from "~/urls";

  const props = defineProps<{
    task?: Task;
    rec?: Rec;
  }>();

  const hooks = {
    taskListStore: useTaskListStore(),
    nav: useRecNav(),
  };
</script>

<template>
  <CFlex
    v-if="hooks.nav.recPrev.value || hooks.nav.recNext.value"
    align="center"
    gap="3"
  >
<!--    <CButton-->
<!--      key="2"-->
<!--      px="3"-->
<!--      variant="outline"-->
<!--    >-->
<!--      <CIcon name="list" fill="white" size="6" />-->
<!--    </CButton>-->

    <NuxtLink
      :to="hooks.nav.recPrev.value ? hooks.nav.recPrevUrl.value : ''"
      :prefetch="true"
    >
      <CButton
        left-icon="bi-caret-left-fill"
        variant="outline"
        fill="blue.500"
        :disabled="!hooks.nav.recPrev.value"
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
      :to="hooks.nav.recNext.value ? hooks.nav.recNextUrl.value : ''"
      :prefetch="true"
    >
      <CButton
        right-icon="bi-caret-right-fill"
        variant="outline"
        fill="blue.500"
        :disabled="!hooks.nav.recNext.value"
        pr="3"
      >
        Next
      </CButton>
    </NuxtLink>
  </CFlex>
</template>
