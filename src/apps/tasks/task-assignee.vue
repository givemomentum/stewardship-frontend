<script lang="ts" setup>
  import { useApi } from "~/composables/useApi";
  import { useUserListStore } from "~/apps/auth/useUserListStore";
  import { PrimaryKey, User } from "~/apps/auth/interfaces";
  import { CFlex } from "@chakra-ui/vue-next";
  import { DropdownOption, Task } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import OptionSelect from "~/apps/shared/option-select.vue";

  const props = defineProps<{ task: Task }>();

  const hooks = {
    api: useApi(),
    taskListStore: useTaskListStore(),
    userListStore: useUserListStore(),
  };

  const comp = {
    imgSize: "26px",
  };

  async function onSelected(optionNew: DropdownOption<PrimaryKey>) {
    const res = await hooks.api.$patch(
      `/tasks/${props.task.slug}/`,
      // needs both fields because of how DRF works
      { assignee_pk: optionNew.value, assignee: { pk: optionNew.value } },
    );
    if (hooks.taskListStore.taskOpened.value) {
      hooks.taskListStore.taskOpened.value = res.data;
    }
    await hooks.taskListStore.loadTasks();
  }

  function getAssigneeDropdownOption(assignee: User | undefined): DropdownOption<PrimaryKey> | null {
    if (!assignee) {
      return null;
    }

    return {
      id: assignee.pk,
      value: assignee.pk,
      label: `${assignee.first_name} ${assignee.last_name}`,
      email: assignee.email,
      avatar: assignee.avatar,
      first_name: assignee.first_name,
    };
  }

  function serializeUsersAsOptions(): Array<DropdownOption<PrimaryKey>> {
    return hooks.userListStore.userList.value.map(user => getAssigneeDropdownOption(user)!);
  }
</script>

<template>

  <OptionSelect
    :option-current="getAssigneeDropdownOption(props.task.assignee)"
    :options="serializeUsersAsOptions()"
    :on-selected="onSelected"
    pos="right"
  >
    <template v-slot:option-current="slotProps">
      <chakra.img
        v-if="slotProps.optionCurrent?.avatar"
        :src="slotProps.optionCurrent.avatar"
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
      <CFlex
        v-else
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
        :bg="slotProps.optionCurrent ? 'blue.100' : 'gray.100'"
        align="center"
        justify="center"
      >
        {{ slotProps.optionCurrent ? slotProps.optionCurrent.first_name.slice(0, 1) : '' }}
      </CFlex>
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
        :bg="slotProps.option.id === slotProps.optionCurrent?.id ? 'gray.100' : ''"
        transition-property="all"
        transition-duration="normal"
        w="100%"
      >
        <chakra.img
          v-if="slotProps.option.avatar"
          :src="slotProps.option.avatar"
          border-radius="full"
          :w="comp.imgSize"
          :h="comp.imgSize"
        />
        <CFlex
          v-else
          border-radius="full"
          :min-w="comp.imgSize"
          :h="comp.imgSize"
          bg="blue.100"
          align="center"
          justify="center"
        >
          {{ slotProps.option.first_name.slice(0, 1) }}
        </CFlex>

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
