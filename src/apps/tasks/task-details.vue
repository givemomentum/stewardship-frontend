<script lang="ts" setup>
  import { CFlex, CBox } from "@chakra-ui/vue-next";
  import { Task } from "~/apps/tasks/interfaces";

  const props = defineProps<{ task: Task; }>();
</script>

<template>
  <CFlex gap="1" direction="column">
    <CBox p="6" pt="4" bg="white" border="1px solid" border-color="gray.100">
      <TaskHead :task="props.task" size="xl" font-weight="bold" />
    </CBox>

    <TaskDetailRecListGifts
      v-if="(
        props.task?.rec_set?.type === 'gifts'
        || props.task?.rec_set?.type === 'letters'
      )"
      :task="props.task"
    />
    <TaskDetailRecListDonors
      v-if="(
        props.task?.rec_set?.type === 'donors'
        || props.task?.rec_set?.type === 'donor_emails'
      )"
      :task="props.task"
    />

    <CBox p="6" pt="0" bg="gray.75">
      <CHeading
        v-if="props.task.rec_set?.recs?.length && props.task.comments_count"
        font-size="xl"
        font-weight="normal"
        mt="-1"
        color="gray.500"
      >
        Comments
      </CHeading>
      <TaskComments :task="props.task" />
    </CBox>
  </CFlex>
</template>

<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/styles/chakra-ui.scss';
  //noinspection CssUnknownTarget
  @import '~/styles/formkit.scss';
</style>
