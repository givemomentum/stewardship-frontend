<script lang="ts" setup>
  type InputVal = number | string;

  const props = defineProps<{
    label?: InputVal;
    cta?: string;
    apiPath: string;
    serializer: (value: InputVal) => any;
    initial?: InputVal;
    successMessage?: (message: InputVal) => string;
    isAutoTag?: boolean;
    type?: "date" | "number" | "string";
    iconName?: string;
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    modelUpdated: (model: any) => void;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    value: ref(props.initial ?? ""),
    isEditMode: ref(false),
    isSaving: ref(false),
    labelSimple: ref(props.initial),
  };

  watch(() => props.initial, (newVal: string) => {
    if (newVal) {
      state.labelSimple.value = String(newVal).replace("https://", "").replace("www.", "");
    } else {
      state.labelSimple.value = "";
    }
  }, { immediate: true });

  async function updateDate() {
    state.isSaving.value = true;
    if (props.type === "number") {
      state.value.value = Number(state.value.value);
    }
    await hooks.api.patch(
      props.apiPath,
      props.serializer(state.value.value),
    );
    state.isSaving.value = false;

    let successMessage = "Field saved";
    if (props.successMessage) {
      successMessage = props.successMessage(state.value.value);
    }
    hooks.notify.send(successMessage);

    emit("modelUpdated", state.value.value as any);
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
      <CIcon v-if="props.iconName" :name="props.iconName" color="gray.500" />

      <chakra.span v-if="props.label || state.labelSimple.value">
        <CLink v-if="props.placeholder?.includes('http')" :href="props.initial">
          {{ props.label || state.labelSimple.value }}
        </CLink>

        <span v-else>{{ props.label || state.labelSimple.value }}</span>
      </chakra.span>

      <CTooltip
        v-if="props.isAutoTag"
        label="The proposed date picked by the system"
        has-arrow
      >
        <CTag>Default</CTag>
      </CTooltip>
    </CFlex>

    <CInput
      v-else
      :type="props.type ?? 'date'"
      :min="props.type === 'number' ? '1' : ''"
      size="xs"
      :w="props.type === 'number' ? '55px' : 'fit-content'"
      v-model="state.value.value"
      :placeholder="props.placeholder"
    />

    <CButton
      v-if="!state.isEditMode.value"
      @click="state.isEditMode.value = !state.isEditMode.value"
      size="xs"
      :variant="props.cta ? 'outline' : 'ghost'"
      key="2"
    >
      <span v-if="props.cta">{{ props.cta }}</span>
      <CIcon v-else name="edit" />
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
