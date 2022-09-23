<script setup lang="ts">
  import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";
  import { useRuntimeConfig } from "#app";
  import { Md5 } from "ts-md5";
  import { onMounted, ref } from "vue";
  import { useApi } from "~/composables/useApi";
  import { Task, PrimaryKey, TaskStatus } from "~/interfaces";
  import useUserStore from "~/stores/useUserStore";
  import { formatDistance, format } from "date-fns";

  const hooks = {
    config: useRuntimeConfig(),
    api: useApi(),
    user: useUserStore(),
  };
  
  const state = {
    tasks: ref<Task[]>([]),
  };
  
  onMounted(async () => {
    const res = await hooks.api.$get(`${hooks.config.public.apiBase}/tasks/`);
    state.tasks.value = res.data;
  });
  function getTaskStatusColor(status: TaskStatus): string {
    switch (status) {
      case "draft": return "gray.500";
      case "pending": return "gray.500";
      case "recommended": return "teal.500";
      case "recommendation_declined": return "gray.500";
      case "review": return "blue.500";
      case "scheduled": return "green.500";
      case "in_progress": return "green.500";
      case "completed": return "gray.500";
      case "failed": return "red.500";
      case "archived": return "red.500";
    }
  }

  function getGravatarURL(email: string) {
    const emailNormalized = String(email).trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${Md5.hashStr(emailNormalized)}`;
  }
</script>

<template>
  <CFlex direction="column" v-if="hooks.user.isLoggedIn" gap="3">

    <CHeading size="md" mt="6" mb="4">Tasks</CHeading>

    <CFlex
      v-for="task in state.tasks.value"
      :key="task.pk"
      direction="column"
      gap="3"
      mt="4"
      p="4"
      max-w="700px"
      bg="white"
      border-radius="lg"
    >
      <CFlex align="center" justify="space-between">
        <CText font-size="lg">{{ task.title }}</CText>
        <chakra.img
          v-for="assignee in task.assignees"
          :key="assignee.email"
          :src="getGravatarURL(assignee.email)"
          bg="blue.500"
          border-radius="full"
          w="26px"
          h="26px"
        />
      </CFlex>
      
      <CBox
        p="2px"
        px="6px"
        :bg="getTaskStatusColor(task.status)"
        color="white"
        w="fit-content"
        font-size="sm"
        border-radius="md"
        text-transform="capitalize"
      >
        {{ task.status }}
      </CBox>
      
      <CText v-if="task.description" font-size="md" color="gray.500">{{ task.description }}</CText>

      <CFlex
        justify="space-between"
        align="center"
        font-size="xs"
        color="gray.500"
      >

        <CFlex
          align="center"
          color="gray.500"
          gap="1"
        >
          <CIcon name="message-square"/>
          <CText>5</CText>
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
  
  <CHeading v-else size="md">
    Welcome!
  </CHeading>
</template>

<style lang="scss">
  html, body {
    background: #f4f8fb;
  }
</style>
