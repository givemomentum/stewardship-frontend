<script lang="ts" setup>
  import { Rec, Task } from "~/apps/tasks/interfaces";
  import RDonorExpectedValue from "~/apps/tasks/recs/r-donor-expected-value.vue";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { urls } from "~/urls";

  const props = defineProps<{ task: Task; }>();

  useHead({
    title: props.task.title,
  });

  const hooks = {
    tasks: useTaskListStore(),
  };

  function openRec(rec: Rec) {
    hooks.tasks.recOpened.value = rec;
    navigateTo(urls.tasks.detailRec(props.task.slug, rec.slug));
  }
</script>

<template>
  <CFlex gap="1" direction="column" bg="gray.75" h="100%">
    <CBox
      p="6"
      pt="4"
      bg="white"
      border="1px solid"
      border-color="gray.100"
    >
      <TaskHead :task="props.task" size="xl" font-weight="bold" />

      <CFlex mt="4">
        <RDonorExpectedValue
          v-if="props.task?.rec_set?.type === 'donors'"
          :task="props.task"
        />
      </CFlex>

      <CButton
        v-if="props.task.rec_set?.recs?.filter(rec => rec.state === 'new')?.length"
        @click="openRec(props.task.rec_set?.recs?.find(rec => rec.state === 'new'))"
        mt="5"
      >
        Take action
      </CButton>
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
