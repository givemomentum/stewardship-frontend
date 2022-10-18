<script lang="ts" setup>
  import { CBox } from "@chakra-ui/vue-next";
  import { computed, onMounted, onUnmounted } from "vue";

  const props = defineProps<{
    modelValue: any;
    w?: string;
  }>();

  const emit = defineEmits(["update:modelValue"]);

  const state = {
    isOpened: computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    }),
  };

  onMounted(async () => {
    window.addEventListener("keydown", handleKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyUp);
  });

  function handleKeyUp(event) {
    const isEscKey = event.keyCode === 27;
    if (isEscKey) {
      state.isOpened.value = false;
    }
  }

</script>

<template>
  <CBox>
    <CBox
      v-if="state.isOpened.value"
      pos="fixed"
      top="0"
      right="0"
      bottom="0"
      :w="props.w ?? '4xl'"
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
