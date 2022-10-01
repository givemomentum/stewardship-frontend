<script lang="ts" setup>
  import { CFlex, CBox, CLink, CText, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";
  import { computed, ref } from "vue";
  import { Task } from "~/interfaces";

  const props = defineProps<{
    modelValue: any;
  }>();

  const emit = defineEmits(["update:modelValue"]);

  const state = {
    isOpened: computed({
      get() {
        return props.modelValue;
      },
      set(value: boolean) {
        emit("update:modelValue", value);
      },
    }),
  };
</script>

<template>
  <CBox>
    <CBox
      v-if="state.isOpened.value"
      pos="fixed"
      top="0"
      right="0"
      bottom="0"
      w="4xl"
      box-shadow="lg"
      bg="gray.75"
      z-index="modal"
      overflow-y="scroll"
     >
      <slot />
    </CBox>

    <CBox
      v-if="state.isOpened.value"
      @click="state.isOpened.value = false"
      @key.esc="state.isOpened.value = false"
      pos="fixed"
      w="100vw"
      h="100vh"
      left="0"
      top="0"
      z-index="overlay"
      bg="blackAlpha.600"
    />
  </CBox>
</template>
