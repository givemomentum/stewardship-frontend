<script lang="ts" setup>
  import { ref } from "vue";
  import { Task, TaskStatusStr } from "~/interfaces";
  import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";
  import VSelect from "vue-select";
  import "vue-select/dist/vue-select.css";

  const props = defineProps<{ task: Task }>();
  
  const state = {
    status: ref<TaskStatusStr>(props.task.status),
  }
  
  function getTaskStatusColor(status: TaskStatusStr): string {
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

</script>

<template>
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
    
<!--  <CBox-->
<!--    p="2px"-->
<!--    px="6px"-->
<!--    :bg="getTaskStatusColor(state.status.value)"-->
<!--    color="white"-->
<!--    w="fit-content"-->
<!--    font-size="sm"-->
<!--    border-radius="md"-->
<!--    text-transform="capitalize"-->
<!--  >-->
<!--    <VSelect :options="['Recommended', 'Draft']" v-model="state.status.value" />-->
<!--  </CBox>-->

  </CBox>
  
</template>

<style lang="scss">
  .v-select {
    width: fit-content;

    .vs__dropdown-toggle {
      appearance: none;
      display: flex;
      padding: 0;
      background: none;
      border: 0;
      border-radius: var(--vs-border-radius);
      white-space: normal;
      color: white;
      
      .vs__selected-options {
        padding: 0;

        .vs__selected {
          margin: 0;
          border: 0;
          padding: 0;
          color: white;
        }
      }
    }
  }
</style>
