<script setup lang="ts">
  import { useRuntimeConfig } from "#app";
  import { useUserListStore } from "~/apps/auth/useUserListStore";
  import { Task } from "~/apps/tasks/interfaces";
  import { useApi } from "~/composables/useApi";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { useLayoutControl } from "~/composables/useLayoutControl";
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
    layout: useLayoutControl(),
    userStore: useUserStore(),
    tasks: useTaskListStore(),
    userListStore: useUserListStore(),
  };

  const state = {
    isRecSetLoaded: ref(false),
  };

  const comp = {
    currentTasksLink: computed(
      () => `${urls.tasks.list}${props.isPublishedOnly ? "" : "?include_unpublished=true"}`,
    ),
    allTasksLink: computed(
      () => `${urls.tasks.listAll}${props.isPublishedOnly ? "" : "?include_unpublished=true"}`,
    ),
  };

  function getTaskDetailUrl(task: Task): string {
    const isTaskHasDetails = task?.rec_set?.rule?.executor_class === "letter_template_executor";
    if (isTaskHasDetails) {
      return urls.tasks.detail(task.slug);
    }
    const firstRecUnhandled = task.rec_set?.recs?.find(rec => rec.state === "new");
    if (firstRecUnhandled) {
      return urls.tasks.detailRec(task.slug, firstRecUnhandled.slug);
    } else {
      const firstRec = task.rec_set?.recs?.[0];
      return urls.tasks.detailRec(task.slug, firstRec.slug);
    }
  }

  onMounted(async () => {
    hooks.tasks.resetTaskOpened();

    await hooks.tasks.loadTasksRecSet({
      isPublishedOnly: props.isPublishedOnly ?? true,
      isShowAllTasks: props.isShowAllTasks,
    });

    let isNeedToTryLoadingAllTasks = props.isShowAllTasks ?? false;
    if (props.taskOpenedSlug) {
      let taskFromSlug = hooks.tasks.tasks.value.find(
        task => task.slug === props.taskOpenedSlug,
      );
      isNeedToTryLoadingAllTasks = !taskFromSlug;
      if (isNeedToTryLoadingAllTasks) {
        await hooks.tasks.loadTasksRecSet({
          isPublishedOnly: props.isPublishedOnly ?? true,
          isShowAllTasks: true,
        });
        taskFromSlug = hooks.tasks.tasks.value.find(
          task => task.slug === props.taskOpenedSlug,
        );
      }
      hooks.tasks.taskOpened.value = taskFromSlug;
    }
  });

  onMounted(() => hooks.layout.bg.value = "gray.75");
  onBeforeUnmount(() => hooks.layout.bg.value = "white");

  watch(hooks.tasks.taskOpened, async (task?: Task) => {
    if (task) {
      navigateTo(getTaskDetailUrl(task));
    } else if (props.isShowAllTasks) {
      navigateTo(urls.tasks.listAll);
    } else {
      navigateTo(urls.tasks.list);
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
      <NuxtLink
        v-for="task in hooks.tasks.tasks.value"
        :key="task.pk"
        :to="getTaskDetailUrl(task)"
      >
        <CLink
          display="block"
          :_hover="{ cursor: 'pointer', borderColor: 'gray.200' }"
          w="100%"
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
              :is-rec-set-loaded="hooks.tasks.isRecsLoaded.value"
            />

            <CFlex
              justify="space-between"
              align="flex-end"
              key="4"
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
              </CFlex>

              <CButton v-if="task.status === 'recommended'">Handle</CButton>
              <CButton v-else variant="outline">Review</CButton>

            </CFlex>

          </CFlex>
        </CLink>
      </NuxtLink>

      <CBox v-if="!hooks.tasks.tasks.value.length && hooks.tasks.isRecsLoaded.value">
        <CHeading v-if="!props.isShowAllTasks" font-size="xl" font-weight="normal">
          You're all done 🎉 !
        </CHeading>
        <CBox v-if="props.isShowAllTasks">
          No tasks yet.
        </CBox>
      </CBox>

      <CBox mt="2">
        <NuxtLink v-if="!props.isShowAllTasks" :to="comp.allTasksLink.value">
          <CButton
            size="sm"
            variant="outline"
            bg="white"
            color-scheme="gray"
          >
            Show completed tasks
          </CButton>
        </NuxtLink>
        <NuxtLink v-else :to="comp.currentTasksLink.value">
          <CButton
            size="sm"
            variant="outline"
            color-scheme="gray"
            bg="white"
          >
            Hide completed tasks
          </CButton>
        </NuxtLink>
      </CBox>

    </CFlex>

    <ChakraDrawer
      v-if="hooks.tasks.taskOpened.value?.rec_set?.rule?.executor_class === 'letter_template_executor'"
      v-model="hooks.tasks.taskOpened.value"
    >
      <TaskDetails :task="hooks.tasks.taskOpened.value" />
    </ChakraDrawer>
  </CFlex>

</template>
