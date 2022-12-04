<script lang="ts" setup>
  import { CFlex, CText } from "@chakra-ui/vue-next";
  import { Task } from "~/apps/tasks/interfaces";

  const props = defineProps<{ task: Task; isPreview?: boolean; size?: string; fontWeight?: string; }>();
</script>

<template>
  <CFlex gap="3" direction="column">
    <CFlex align="center" justify="space-between" gap="4">
      <CText
        :font-size="props.size ?? 'lg'"
        :font-weight="props.fontWeight ?? 'normal'"
      >
        {{ task.title }}
      </CText>
      <CText v-if="!task.is_published" font-size="sm" font-weight="light" color="gray.500">
        (not published)
      </CText>
      <TaskAssignee :task="props.task" />
    </CFlex>

    <TaskStatus :task="props.task" />

    <CText
      class="task-desc"
      :data-is-preview="props.isPreview"
      v-if="props.isPreview"
      font-size="md"
      color="gray.500"
      v-html="task.description?.length > 160 ? `${task.description?.slice(0, 160)} [...]` : task.description"
    />

    <CText
      class="task-desc"
      :data-is-preview="props.isPreview"
      v-if="task.description && !props.isPreview"
      font-size="md"
      v-html="task.description"
    />
  </CFlex>
</template>

<style lang="scss">
  .task-desc {
    a {
      color: var(--colors-blue-500);
    }
  }
</style>
