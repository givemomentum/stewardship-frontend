<script lang="ts" setup>
  import { Recommendation } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { useForm } from "~/composables/useForm";

  const props = defineProps<{
    rec: Recommendation;
    onSuccess: (form, responseData) => Promise<void>;
  }>();

  const hooks = {
    taskListStore: useTaskListStore(),
    form: useForm({
      path: () => `recs/${props.rec.pk}/log_action/`,
      onSuccess: props.onSuccess,
      method: "POST",
    }),
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

      <FormKit
        type="textarea"
        name="action_description"
        label="Description"
        rows="10" />

      <FormKit type="submit" label="Submit" size="md" />
    </CFlex>
  </FormKit>
</template>
