<script lang="ts" setup>
  import { Recommendation } from "~/apps/tasks/interfaces";
  import RRecStatus from "~/apps/tasks/recs/r-rec-status.vue";
  import { useRecNav } from "~/apps/tasks/recs/useRecNav";
  import { useRecStatus } from "~/apps/tasks/recs/useRecStatus";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useNotify } from "~/composables/useNotify";
  import RRecSkipBtn from "~/apps/tasks/recs/r-btn-skip.vue";

  const props = defineProps<{
    rec: Recommendation;
    type: Recommendation["action_type"];
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    taskListStore: useTaskListStore(),
    nav: useRecNav(),
    status: useRecStatus(),
  };

  const state = {
    type: ref(props.type),
    actionDescription: ref(props.rec.action_description ?? ""),
    isSubmitting: ref(false),
  };
  
  const comp = {
    typesOther: ["call", "task", "other"],
  };

  watch(() => props.type, (newType) => {
    state.type.value = newType;
  });

  async function logToCRM() {
    if (!state.actionDescription.value) {
      return;
    }
    
    state.isSubmitting.value = true;
    await hooks.api.post(`recs/${props.rec.pk}/log-action/`, {
      action_type: state.type.value,
      action_description: state.actionDescription.value,
    });

    hooks.taskListStore.recOpened.value.state = "completed";
    hooks.taskListStore.recOpened.value.action_description = state.actionDescription.value;
    hooks.taskListStore.recOpened.value.action_type = props.type;
    hooks.notify.send("Action logged");

    state.isSubmitting.value = false;
    
    hooks.nav.navigateToRecNext();
  }
</script>

<template>
  <CFlex
    direction="column"
    mt="3"
    w="100%"
    gap="5"
    align="flex-end"
  >
    <CFlex
      gap="4"
      w="100%"
      v-if="props.type === 'other' && !hooks.status.isSkipped.value"
      pl="2px"
    >
      <chakra.label v-for="type in comp.typesOther" :key="type">
        <chakra.input
          type="radio"
          name="action_type"
          :checked="state.type.value === type"
        />
        <chakra.span text-transform="capitalize">
          {{ type }}
        </chakra.span>
      </chakra.label>
    </CFlex>

    <chakra.form
      w="100%"
      display="flex"
      flex-direction="column"
      gap="5"
      align-items="flex-end"
    >
      <chakra.textarea
        v-if="!hooks.status.isSkipped.value"
        v-model="state.actionDescription.value"
        :value="state.actionDescription.value || props.rec.action_description"
        :disabled="props.rec.state === 'completed'"
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
        :_disabled="{
          bg: 'white',
        }"
        required
      />
      <CFlex gap="5">
        <RRecSkipBtn
          v-if="!hooks.status.isHandled.value"
          :rec="props.rec"
        />
  
        <CButton
          type="submit"
          v-if="!hooks.status.isHandled.value"
          @click="logToCRM"
          :is-loading="state.isSubmitting.value"
        >
          Log to CRM
        </CButton>

        <RRecStatus />

      </CFlex>
    </chakra.form>
  </CFlex>
</template>

<style scoped lang="scss">
  label {
    display: flex;
    gap: var(--chakra-space-1);
  }
</style>