a<script lang="ts" setup>
  const props = defineProps<{
    label: string | number;
    cta?: string;
    apiPath: string;
    serializer: (date: string) => any;
    initial?: string | number;
    successMessage: (date: string) => string;
    isAutoTag?: boolean;
    type?: "date" | "number";
  }>();

  const emit = defineEmits<{
    modelUpdated: (model: any) => void;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    date: ref(props.initial ?? ""),
    isEditMode: ref(false),
    isSaving: ref(false),
  };

  async function updateDate() {
    state.isSaving.value = true;
    let value = state.date.value;
    if (props.type === "number") {
      value = Number(state.date.value);
    }
    await hooks.api.patch(
      props.apiPath,
      props.serializer(value),
    );
    state.isSaving.value = false;
    hooks.notify.send(props.successMessage(state.date.value));
    emit("modelUpdated", value);
    state.isEditMode.value = false;
  }
</script>

<template>
  <CFlex align="center" gap="4">
    <CFlex
      v-if="!state.isEditMode.value"
      color="blue.600"
      align="center"
      gap="2"
    >
      <chakra.span>{{ props.label }}</chakra.span>

      <VTooltip v-if="props.isAutoTag">
        <div>
          <CTag>Default</CTag>
        </div>

        <template v-slot:popper>
          The default, unset by the user
        </template>
      </VTooltip>
    </CFlex>

    <CInput
      v-else
      :type="props.type ?? 'date'"
      :min="props.type === 'number' ? '1' : ''"
      size="xs"
      :w="props.type === 'number' ? '40px' : 'fit-content'"
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
