<script setup lang="ts">
  useHead({
    title: `Tasks all`,
  });
</script>

<template>
  <TaskList
    :is-published-only="!$route.query['include_unpublished']"
    :is-show-all-tasks="true"
  />
</template>
