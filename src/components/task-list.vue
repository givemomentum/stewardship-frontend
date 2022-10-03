<script setup lang="ts">
  import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";
  import { useRuntimeConfig } from "#app";
  import { onMounted, ref, watch } from "vue";
  import { useApi } from "~/composables/useApi";
  import { Task, PrimaryKey, TaskStatusStr } from "~/interfaces";
  import { useTaskListStore } from "~/stores/useTaskListStore";
  import useUserStore from "~/stores/useUserStore";
  import { formatDistance, format } from "date-fns";

  const props = defineProps<{
    taskOpened?: Task;
  }>();

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    userStore: useUserStore(),
    taskListStore: useTaskListStore(),
  };

  onMounted(hooks.taskListStore.loadTasks);
</script>

<template>
  <CFlex v-if="hooks.userStore.isLoggedIn" direction="column" gap="7">
    
    <CHeading
      font-size="3xl"
      mt="6"
      mb="px"
      font-weight="semibold"
    >
      Tasks
    </CHeading>

    <CFlex gap="6" direction="column">
      <CFlex
        v-for="task in hooks.taskListStore.tasks.value"
        :key="task.pk"
        @click="hooks.taskListStore.taskOpened.value = task"
        direction="column"
        gap="3"
        p="4"
        max-w="700px"
        bg="white"
        border-radius="lg"
        border="1px solid white"
        :_hover="{ cursor: 'pointer', borderColor: 'gray.200' }"
      >
        <TaskHead :task="task" :is-preview="true" />
  
        <CFlex
          :justify="task.comments_count ? 'space-between' : 'flex-end'"
          align="center"
          font-size="xs"
          color="gray.500"
        >
  
          <CFlex
            v-if="task.comments_count"
            align="center"
            color="gray.500"
            gap="1"
          >
            <CIcon name="message-square"/>
            <CText>{{task.comments_count}}</CText>
          </CFlex>
          
          <CFlex>
            {{
              formatDistance(new Date(task.created_at), new Date(), {
                addSuffix: true,
              })
            }}
          </CFlex>
  
        </CFlex>
      </CFlex>
    </CFlex>

    <DrawlerSimple v-model="hooks.taskListStore.taskOpened.value">
      <TaskDetails :task="hooks.taskListStore.taskOpened.value" />
    </DrawlerSimple>
  </CFlex>

  <CHeading v-else size="md">
    Welcome!
  </CHeading>

</template>

<style lang="scss">
  html, body {
    background: var(--colors-gray-75) !important;
    height: 100%;
  }
  
  // chakra drawer is broken, revisit one they fix it
  .chakra-modal__content-container {
    width: 0;
    height: 0;

    section {
      z-index: 1400;
    }
  }
  .chakra-modal__overlay { }
</style>
