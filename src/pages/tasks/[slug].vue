<script setup lang="ts">
  import { useRoute } from "#app";
  import { useApi } from "#imports";
  import { onBeforeMount, onMounted, ref } from "vue";
  import { Task } from "~/interfaces";

  const hooks = {
    route: useRoute(),
    api: useApi(),
  };

  const state = {
    task: ref<Task | null>(null),
  };

  onBeforeMount(async () => {
    const res = await hooks.api.$get(`/tasks/${$route.params.slug}`);
    state.task.value = res.data;
  });

</script>

<template>
  <TaskList v-if="state.task.value" :task-opened="state.task.value" />
</template>
