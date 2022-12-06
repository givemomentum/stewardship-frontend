<script lang="ts" setup>
  import { Recommendation } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useForm } from "~/composables/useForm";
  import { ref } from "vue";

  const props = defineProps<{
    rec: Recommendation;
    onSuccess: CallableFunction;
  }>();

  const hooks = {
    taskListStore: useTaskListStore(),
    form: useForm({
      path: () => {
        return `recs/${props.rec.pk}/`;
      },
      getExtraData: () => ({
        action_state: "logged_by_user",
      }),
      onSuccess: props.onSuccess,
      method: "PATCH",
    }),
  };

  const state = {
    alertMessage: ref<string | null>(null),
  };
</script>

<template>
  <FormKit
    type="form"
    @submit="hooks.form.submit"
    :actions="false"
    :key="props.rec.pk">
    <CFlex justify="flex-start" direction="column" pt="4">
      <FormKit
        type="select"
        placeholder="Select an action type"
        name="action_type"
        :options="['call', 'letter', 'email', 'other']"
        validation="required"
        validation-visibility="submit"
      />

      <FormKit type="textarea" name="action_description" label="Description"
               rows="10" />

      <FormKit type="submit" label="Submit" size="md" />
    </CFlex>
  </FormKit>
</template>