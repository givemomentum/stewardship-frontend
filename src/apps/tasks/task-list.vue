<script setup lang="ts">
  import { useRuntimeConfig } from "#app";
  import { useUserListStore } from "~/apps/auth/useUserListStore";
  import { Task } from "~/apps/tasks/interfaces";
  import { useApi } from "~/composables/useApi";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { formatDistance } from "date-fns";
  import { urls } from "~/urls";
  import { computed } from "vue";

  const props = defineProps<{
    taskOpenedSlug?: string;
    isShowAllTasks?: boolean;
    isPublishedOnly?: boolean;
  }>();

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    userStore: useUserStore(),
    taskListStore: useTaskListStore(),
    userListStore: useUserListStore(),
  };

  const state = {
    isRecSetLoaded: ref(false),
  };

  const comp = {
    currentTasksLink: computed(() => {
      return `${urls.tasks.list}${props.isPublishedOnly ? '' : '?include_unpublished=true'}`;
    }),
    allTasksLink: computed(() => {
      return `${urls.tasks.listAll}${props.isPublishedOnly ? '' : '?include_unpublished=true'}`;
    }),
  }

  onMounted(async () => {
    await hooks.taskListStore.loadTasks({
      isPublishedOnly: props.isPublishedOnly ?? true,
      isShowAllTasks: props.isShowAllTasks,
    });
    if (props.taskOpenedSlug) {
      hooks.taskListStore.taskOpened.value = hooks.taskListStore.tasks.value.find(
        (task) => task.slug === props.taskOpenedSlug
      );
    }
    await hooks.taskListStore.loadTaskRecs({
      isPublishedOnly: props.isPublishedOnly ?? true,
      isShowAllTasks: props.isShowAllTasks,
    });
    state.isRecSetLoaded.value = true;
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

    <CFlex justify="space-between" w="100%" align="center" min-w="700px">
      <CHeading variant="page-header">
        {{ props.isShowAllTasks ? 'All Tasks' : 'Tasks' }}
      </CHeading>
    </CFlex>

    <CFlex gap="6" direction="column">
      <CLink
        v-for="task in hooks.taskListStore.tasks.value"
        :key="task.pk"
        @click.prevent="hooks.taskListStore.taskOpened.value = task"
        :href="urls.tasks.detail(task.slug)"
        :_hover="{ cursor: 'pointer', borderColor: 'gray.200' }"
        border-radius="lg"
        border="1px solid white"
      >
        <CFlex
          direction="column"
          gap="3"
          p="4"
          max-w="700px"
          min-w="600px"
          bg="white"
          border-radius="lg"
        >
          <TaskHead
            :task="task"
            :is-preview="true"
            :is-rec-set-loaded="state.isRecSetLoaded.value"
          />

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
                v-if="task.rec_set?.rec_progress"
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
                <CText>
                  {{ task.rec_set?.rec_progress }}
                </CText>
              </CFlex>
              <CFlex
                v-else-if="task.rec_set?.recs?.length"
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
      </CLink>

      <CBox v-if="!hooks.taskListStore.tasks.value.length && state.isRecSetLoaded.value">
        <CHeading v-if="!props.isShowAllTasks" font-size="xl" font-weight="normal">
          You're all done 🎉 !
        </CHeading>
        <CBox v-if="props.isShowAllTasks">
          No tasks yet.
        </CBox>
      </CBox>

      <CBox mt="2">
        <NuxtLink v-if="!props.isShowAllTasks" :to="comp.allTasksLink">
          <CButton
            size="sm"
            variant="outline"
          >
            Show completed tasks
          </CButton>
        </NuxtLink>
        <NuxtLink v-if="props.isShowAllTasks" :to="comp.currentTasksLink">
          <CButton
            size="sm"
            variant="outline"
          >
            Hide completed tasks
          </CButton>
        </NuxtLink>
      </CBox>

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
