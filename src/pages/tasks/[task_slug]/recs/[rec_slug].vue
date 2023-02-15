<script lang="ts" setup>
  import RRecDetail from "~/apps/tasks/recs/r-rec-detail.vue";
</script>

<template>
  <RRecDetail
    :task-slug="$route.params['task_slug']"
    :rec-slug="$route.params['rec_slug']"
  />
</template>
