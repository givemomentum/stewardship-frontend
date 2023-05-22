a<script lang="ts" setup>
  import { format } from "~/utils";
  import { CrmAction, CrmGift, CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    label: string;
    cta?: string;
    apiPath: string;
    serializer: (date: string) => any;
    dateInitial?: string;
    successMessage: (date: string) => string;
  }>();

  const emit = defineEmits<{
    modelUpdated: (model: any) => void;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    date: ref(props.dateInitial ?? ""),
    isEditMode: ref(false),
    isSaving: ref(false),
  };

  async function updateDate() {
    state.isSaving.value = true;
    const res = await hooks.api.patch(
      props.apiPath,
      props.serializer(state.date.value),
    );
    state.isSaving.value = false;
    hooks.notify.send(props.successMessage(state.date.value));
    emit("modelUpdated", state.date.value);
    state.isEditMode.value = false;
  }
</script>

<template>
  <CFlex align="center" gap="4">
    <chakra.span v-if="!state.isEditMode.value" color="blue.600">
      {{ props.label }}
    </chakra.span>

    <CInput
      v-else
      type="date"
      size="xs"
      w="fit-content"
      v-model="state.date.value"
    />
    <CButton
      v-if="!state.isEditMode.value"
      @click="state.isEditMode.value = !state.isEditMode.value"
      size="xs"
      left-icon="edit"
      variant="outline"
    >
      {{ props.cta ?? 'Edit' }}
    </CButton>
    <CFlex v-else gap="2">
      <CButton
        @click="updateDate()"
        size="xs"
        variant="solid"
        :is-loading="state.isSaving.value"
      >
        Save
      </CButton>
      <CButton
        @click="state.isEditMode.value = false"
        size="xs"
        variant="outline"
      >
        x
      </CButton>
    </CFlex>
  </CFlex>
</template>
