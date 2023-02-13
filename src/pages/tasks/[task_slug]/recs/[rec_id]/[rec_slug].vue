<script lang="ts" setup>
  import RRecDetail from "~/apps/tasks/recs/r-rec-detail.vue";
  import { urls } from "~/urls";
  
  definePageMeta({
    pageTransition: {
      name: 'slide-right',
      mode: 'out-in'
    },
    middleware (to, from) {
      if (Number(to.params.rec_id) > Number(from.params.rec_id)) {
        to.meta.pageTransition.name = 'slide-right';
      } else {
        to.meta.pageTransition.name = 'slide-left';
      }
    }
  });
</script>

<template>
  <RRecDetail
    :task-slug="$route.params['task_slug']"
    :rec-slug="$route.params['rec_slug']"
  />
</template>

<style lang="scss" scoped>
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.3s;
  }
  .slide-left-enter-from {
    opacity: 0;
    transform: translate(-50%, 0);
  }
  .slide-left-leave-to {
    opacity: 0;
    transform: translate(50%, 0);
  }
  .slide-right-enter-from {
    opacity: 0;
    transform: translate(50%, 0);
  }
  .slide-right-leave-to {
    opacity: 0;
    transform: translate(-50%, 0);
  }
</style>
