<script lang="ts" setup>
  import { CFlex, CBox } from "@chakra-ui/vue-next";
  import { Task } from "~/apps/tasks/interfaces";

  const props = defineProps<{ task: Task; }>();

</script>

<template>
  <CFlex gap="3" direction="column">
    <CBox p="6" pt="4" bg="white" border="1px solid" border-color="gray.100">
      <TaskHead :task="props.task" />
    </CBox>

    <CBox p="6" pt="0" bg="gray.75">
      <TaskComments :task="props.task" />
    </CBox>
  </CFlex>
</template>

<style lang="scss">
  @import "~/styles/chakra-ui.scss";
  @import "~/styles/formkit.scss";
</style>