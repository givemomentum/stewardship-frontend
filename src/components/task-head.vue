<script lang="ts" setup>
  import { Task } from "~/interfaces";
  import { CFlex, CText } from "@chakra-ui/vue-next";

  const props = defineProps<{ task: Task; isPreview?: boolean; }>();
</script>

<template>
  <CFlex gap="3" direction="column">
    <CFlex align="center" justify="space-between" gap="4">
      <CText font-size="lg">{{ task.title }}</CText>
      <TaskAssignee :task="props.task" />
    </CFlex>

    <TaskStatus :task="props.task" />

    <CText
      v-if="props.isPreview"
      font-size="md"
      color="gray.500"
    >
      {{
        task.description_short
          || task.description_plaintext.length > 160 ? `${task.description_plaintext?.slice(0, 160)} [...]` : task.description_plaintext
      }}
    </CText>

    <CText
      v-if="task.description && !props.isPreview"
      font-size="md"
      v-html="task.description"
    />
  </CFlex>
</template>
