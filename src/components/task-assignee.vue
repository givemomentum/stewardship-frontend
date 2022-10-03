<script lang="ts" setup>
  import { Md5 } from "ts-md5";
  import { ref } from "vue";
  import { useApi } from "~/composables/useApi";
  import { PrimaryKey, Task, TaskStatusStr, User } from "~/interfaces";
  import { CFlex, CBox, CLink, CText, CSpinner, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";
  import { DropdownOption } from "~/interfaces";
  import OptionSelect from "~/components/option-select";
  import { useTaskListStore } from "~/stores/useTaskListStore";

  const props = defineProps<{ task: Task; users: User[] }>();

  const hooks = {
    api: useApi(),
    taskListStore: useTaskListStore(),
  };
  
  const comp = {
    imgSize: "26px",
  }

  async function onSelected(optionNew: DropdownOption<PrimaryKey>) {
    const res = await hooks.api.$patch(
      `/tasks/${props.task.slug}/`,
      { assignees_pks: [optionNew.value], assignees: [{ pk: optionNew.value }] },
    );
    if (hooks.taskListStore.taskOpened.value) {
      hooks.taskListStore.taskOpened.value = res.data;
    }
    await hooks.taskListStore.loadTasks();
  }

  function getAssigneeDropdownOption(assignee: User): DropdownOption<PrimaryKey> {
    return {
      id: assignee.pk,
      value: assignee.pk,
      label: `${assignee.first_name} ${assignee.last_name}`,
      email: assignee.email,
    }
  }

  function getGravatarURL(email: string) {
    const emailNormalized = String(email).trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${Md5.hashStr(emailNormalized)}`;
  }
  
  function serializeUsersAsOptions(): Array<DropdownOption<PrimaryKey>> {
    return props.users.map(user => getAssigneeDropdownOption(user));
  }
</script>

<template>

  <OptionSelect
    :option-current="getAssigneeDropdownOption(props.task.assignees[0])"
    :options="serializeUsersAsOptions(props.users)"
    :on-selected="onSelected"
    pos="right"
  >
    <template v-slot:option-current="slotProps">
      <chakra.img
        :src="getGravatarURL(slotProps.optionCurrent.email)"
        border-radius="full"
        :w="comp.imgSize"
        :h="comp.imgSize"
        :_hover="{
          filter: 'brightness(95%) saturate(105%)',
          cursor: 'pointer',
        }"
        transition-property="all"
        transition-duration="normal"
        :opacity="slotProps.isSavingOption ? 0.5 : 1"
      />
    </template>

    <template v-slot:dropdown-option="slotProps">
      <CFlex
        @click="slotProps.onSelect(slotProps.option)"
        py="7px"
        :px="2"
        :_hover="{
          bg: 'gray.75',
          cursor: 'pointer',
        }"
        :bg="slotProps.option.id === slotProps.optionCurrent.id ? 'gray.100' : ''"
        transition-property="all"
        transition-duration="normal"
        w="100%"
      >
        <chakra.img
          :src="getGravatarURL(slotProps.option.email)"
          border-radius="full"
          :w="comp.imgSize"
          :h="comp.imgSize"
        />
        <CFlex
          py="2px"
          :px="2"
          text-transform="capitalize"
          border-radius="lg"
          w="100%"
          white-space="nowrap"
        >
          {{ slotProps.option.label }}
        </CFlex>
      </CFlex>
    </template>
  </OptionSelect>

</template>
