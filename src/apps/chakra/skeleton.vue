<script lang="ts">
  import { vueThemingProps } from "@chakra-ui/vue-utils";

  export default {
    props: vueThemingProps,
    components: {
      CBox,
    },
  };
</script>

<template>
  <CBox class="chakra-skeleton" v-bind="$props" />
</template>

<style lang="scss" scoped>
@import "~/styles/chakra-ui.scss";

@keyframes blink {
  0% {
    background-color: var(--chakra-colors-gray-300);
  }
  50% {
    background-color: var(--chakra-colors-gray-100);
  }
  100% {
    background-color: var(--chakra-colors-gray-300);
  }
}

.chakra-skeleton {
  border-radius: var(--chakra-radii-md);
  border-color: var(--chakra-colors-gray-100);
  background: padding-box var(--chakra-colors-gray-300);
  animation: blink normal 1.2s infinite linear;
}
</style>
