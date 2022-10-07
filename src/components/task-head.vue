<script lang="ts" setup>
  import { Task, User } from "~/interfaces";
  import { CFlex, CText } from "@chakra-ui/vue-next";

  const props = defineProps<{ task: Task; users: User[]; isPreview?: boolean; }>();
</script>

<template>
  <CFlex gap="3" direction="column">
    <CFlex align="center" justify="space-between">
      <CText font-size="lg">{{ task.title }}</CText>
      <TaskAssignee :task="props.task" :users="props.users" />
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
