<script lang="ts" setup>
  import { Md5 } from "ts-md5";
  import { Task, TaskStatusStr } from "~/interfaces";
  import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";

  const props = defineProps<{ task: Task, isPreview?: boolean; }>();
  
  function getTaskStatusColor(status: TaskStatusStr): string {
    switch (status) {
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
        border-radius="full"
        w="26px"
        h="26px"
      />
    </CFlex>
    
    <TaskStatus :task="props.task" />

    <CText
      v-if="props.isPreview"
      font-size="md"
      color="gray.500"
    >
      {{
        task.description_short
        || task.description_plaintext ? `${task.description_plaintext?.slice(0, 160)} [...]` : ""
      }}
    </CText>

    <CText
      v-if="task.description && !props.isPreview"
      font-size="md"
      v-html="task.description"
    />
  </CFlex>
</template>
