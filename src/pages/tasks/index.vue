<script setup lang="ts">
  useHead({
    title: `Tasks`,
  });
</script>

<template>
  <TaskList :is-published-only="!$route.query.include_unpublished" />
</template>
