<script lang="ts" setup>
  import { Recommendation } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useNotify } from "~/composables/useNotify";

  const props = defineProps<{
    rec: Recommendation;
    type: "call" | "task" | "message" | "other";
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    taskListStore: useTaskListStore(),
  };

  const state = {
  };
</script>

<template>
  <CFlex
    direction="column"
    mt="3"
    w="100%"
    gap="5"
    align="flex-end"
  >
    <CFlex gap="4" w="100%" v-if="props.type === 'other'" pl="2px">
      <chakra.label>
        <chakra.input type="radio" name="category" checked />
        <chakra.span>Other</chakra.span>
      </chakra.label>
      <chakra.label>
        <chakra.input type="radio" name="category" />
        <chakra.span>Task</chakra.span>
      </chakra.label>
      <chakra.label>
        <chakra.input type="radio" name="category" />
        <chakra.span>Meeting</chakra.span>
      </chakra.label>
    </CFlex>

    <chakra.textarea
      w="100%"
      min-h="52"
      h="52"
      p="3"
      border-width="1px"
      :_hover="{ borderColor: 'gray.400' }"
      :_focus="{ borderColor: 'blue.500 !important' }"
      :_focus-visible="{
        outline: '0',
      }"
      :placeholder="props.type === 'other' ? 'Write down notes to log to your CRM' : `Write down notes about your ${props.type} to CRM`"

      border-radius="lg"
      border-color="gray.300"
      transition-property="common"
      transition-duration="normal"
    />
    <CFlex gap="5">
      <CButton
        variant="outline"
        color-scheme="gray"
      >
        Skip
      </CButton>
      <CButton>Log to CRM</CButton>
    </CFlex>
  </CFlex>
</template>

<style scoped lang="scss">
  label {
    display: flex;
    gap: var(--chakra-space-1);
  }
</style>
