<script setup lang="ts">
  import { useRuntimeConfig } from "#app";
  import { onMounted, ref } from "vue";
  import { useUserListStore } from "~/apps/auth/useUserListStore";
  import { Task } from "~/apps/tasks/interfaces";
  import { useApi } from "~/composables/useApi";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { formatDistance } from "date-fns";

  const props = defineProps<{
    taskOpenedSlug?: string;
  }>();

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    userStore: useUserStore(),
    taskListStore: useTaskListStore(),
    userListStore: useUserListStore(),
  };

  onMounted(async () => {
    await hooks.taskListStore.loadTasks();
    if (props.taskOpenedSlug) {
      hooks.taskListStore.taskOpened.value = hooks.taskListStore.tasks.value.find(
        (task) => task.slug === props.taskOpenedSlug
      );
    }
    await hooks.taskListStore.loadTaskRecs();
  });

  watch(hooks.taskListStore.taskOpened, (task?: Task) => {
    // router.push always forces a full reload 
    if (task) {
      history.pushState({}, "", `/tasks/${task.slug}`);
    } else {
      history.pushState({}, "", `/tasks`);
    }
  });
</script>

<template>
  <CFlex v-if="hooks.userStore.isLoggedIn" direction="column" gap="7">

    <CHeading variant="page-header">
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
        min-w="600px"
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

          <CFlex gap="5">
            <CFlex
              v-if="task.comments_count"
              align="center"
              color="gray.500"
              gap="1"
            >
              <CIcon name="message-square" />
              <CText>{{ task.comments_count }}</CText>
            </CFlex>

            <CFlex
              v-if="task.rec_set?.recs?.length"
              align="center"
              color="gray.500"
              gap="1"
            >
              <CIcon
                :name="task.rec_set.type === 'gifts' ? 'fa-donate' : 'bi-people-fill'"
                fill="gray.400"
                size="17px"
                mb="px"
              />
              <CText>{{ task.rec_set.recs?.length }}</CText>
            </CFlex>
          </CFlex>

          <CFlex ml="auto">
            {{
              formatDistance(new Date(task.created_at), new Date(), {
                addSuffix: true,
              })
            }}
          </CFlex>

        </CFlex>
      </CFlex>
    </CFlex>

    <ChakraDrawer v-model="hooks.taskListStore.taskOpened.value">
      <TaskDetails :task="hooks.taskListStore.taskOpened.value" />
    </ChakraDrawer>
  </CFlex>

</template>

<style lang="scss">
  html, body {
    background: var(--chakra-colors-gray-75) !important;
    height: 100%;
  }
</style>
