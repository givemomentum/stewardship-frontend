<script lang="ts" setup>
  import RRecDetail from "~/apps/tasks/recs/r-rec-detail.vue";
  import { urls } from "~/urls";
  
  // definePageMeta({
  //   pageTransition: {
  //     name: 'fade',
  //     mode: 'out-in'
  //   },
  // });
</script>

<template>
  <RRecDetail
    :task-slug="$route.params['task_slug']"
    :rec-slug="$route.params['rec_slug']"
  />
</template>

<style lang="scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.1s;
  }
  .fade-enter-from {
    opacity: 0;
    //transform: translate(0, -50%);
  }
  .fade-leave-to {
    opacity: 0;
    //transform: translate(0, 50%);
  }
</style>
