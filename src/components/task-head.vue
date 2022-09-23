<script lang="ts" setup>
  import { Md5 } from "ts-md5";
  import { Task, TaskStatus } from "~/interfaces";
  import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";

  const props = defineProps<{ task: Task }>();
  
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
  <CFlex gap="3" direction="column">
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
  </CFlex>
</template>
