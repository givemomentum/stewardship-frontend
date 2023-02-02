<script lang="ts" setup>
  import { useUserStore } from "~/apps/auth/useUserStore";
  import { Task } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";

  const props = defineProps<{
    task: Task;
    isPreview?: boolean;
    isRecSetLoaded?: boolean;
    size?: string;
    fontWeight?: string;
  }>();
  const hooks = {
    userStore: useUserStore(),
  };
  
  const comp = {
    isOrgKesslerEdgeCase: computed(() => hooks.userStore.user.membership.org.slug === 'kessler' && props.task.title === "Thank you emails"),
  }
</script>

<template>
  <CFlex gap="3" direction="column">
    <CFlex align="center" justify="space-between" gap="4">
      <CFlex gap="3" flex-wrap="nowrap">
        <CText
          :font-size="props.size ?? 'lg'"
          :font-weight="props.fontWeight ?? 'normal'"
        >
          {{ task.title }}
        </CText>

        <CTag v-if="props.isRecSetLoaded && !comp.isOrgKesslerEdgeCase">
          {{ format.dateHumanShort(props.task.rec_set?.recs_datetime_filter_end ?? props.task.created_at) }}
        </CTag>
        <CTag v-if="props.isRecSetLoaded && comp.isOrgKesslerEdgeCase">
          {{ format.dateHumanShort(props.task.rec_set?.recs_datetime_filter_start ?? props.task.created_at) }}
        </CTag>

        <CTag v-if="!task.is_published" colorScheme="red">
          Unpub
        </CTag>
      </CFlex>
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
      color: var(--chakra-colors-blue-500);
    }
  }
</style>
