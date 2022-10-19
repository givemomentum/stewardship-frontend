<script setup lang="ts">
  import { CFlex, CText, CIcon, CHeading } from "@chakra-ui/vue-next";
  import { navigateTo, useRouter, useRuntimeConfig } from "#app";
  import { onBeforeMount, onMounted, ref, watch } from "vue";
  import { useApi } from "~/composables/useApi";
  import { Task, User } from "~/interfaces";
  import { useTaskListStore } from "~/stores/useTaskListStore";
  import useUserStore from "~/stores/useUserStore";
  import { urls } from "~/urls";
  import { formatDistance } from "date-fns";

  const props = defineProps<{
    taskOpened?: Task;
  }>();

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    userStore: useUserStore(),
    taskListStore: useTaskListStore(),
  };

  const state = {
    users: ref<User[]>([]),
    taskOpened: ref<Task | null>(props.taskOpened ?? null),
  };

  onMounted(async () => {
    hooks.taskListStore.loadTasks();
    loadUsers();
  });

  async function loadUsers() {
    const res = await hooks.api.$get("/users/");
    state.users.value = res.data;
  }
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
        @click="navigateTo({ path: urls.tasks.detail(task.slug) })"
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
        <TaskHead :task="task" :is-preview="true" :users="state.users.value" />

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
            <CIcon name="message-square" />
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

    <DrawlerSimple v-model="state.taskOpened.value">
      <TaskDetails :task="state.taskOpened.value" :users="state.users.value" />
    </DrawlerSimple>
  </CFlex>

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
