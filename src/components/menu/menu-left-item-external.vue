<script setup lang="ts">
  import { CIcon, CLink, CFlex, chakra } from "@chakra-ui/vue-next";
  import { useLeftMenu } from "~/composables/useLeftMenu";

  const props = defineProps<{
    url: string;
    label: string;
    iconName: string;
    iconColorProp?: "fill" | "color";
  }>();

  const hooks = {
    menu: useLeftMenu(),
  };
</script>

<template>
  <CLink
    display="flex"
    variant="side-menu"
    :href="props.url"
    align-items="center"
    justify-content="space-between"
    is-external
  >
    <CFlex gap="3" align-items="center">
      <CIcon
        :name="props.iconName"
        v-bind:[props.iconColorProp]="'blue.100'"
        font-size="2xl"
      />
      <chakra.span v-if="hooks.menu.isFullWidth.value">{{ props.label }}</chakra.span>
    </CFlex>
  </CLink>

</template>
