<script lang="ts" setup>
  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
  }>();

  const emit = defineEmits(["update:modelValue"]);

  const value = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit("update:modelValue", value);
    },
  });
</script>

<template>
  <CFlex class="ck-editor-invisible">
    <NuxtCkeditor
      v-model="value"
      :placeholder="props.placeholder"
    />
  </CFlex>
</template>

<style lang="scss">
  .ck-editor-invisible {
    .ck-content {
      &.ck.ck-editor__editable {
        border-radius: var(--chakra-radii-md) !important;
        border: 1px solid white;
        background: white;

        &:hover {
          border-color: var(--chakra-colors-gray-200);
        }
        &:focus {
          border-color: var(--chakra-colors-gray-300);
        }
      }
    }
  }
</style>
