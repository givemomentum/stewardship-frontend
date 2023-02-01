<script setup lang="ts">
  const hooks = {
    route: useRoute(),
  };

  const state = {
    taskSlugInitial: ref<string | string[]>(hooks.route.params.slug),
  };
</script>

<template>
  <TaskList :task-opened-slug="state.taskSlugInitial.value" />
</template>
