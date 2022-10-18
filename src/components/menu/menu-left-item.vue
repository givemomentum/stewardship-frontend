<script setup lang="ts">
  import { CIcon, CLink, CFlex, chakra } from "@chakra-ui/vue-next";
  import { useLeftMenu } from "~/composables/useLeftMenu";

  const props = defineProps<{
    url: string;
    label: string;
    iconName: string;
    iconColorProp?: "fill" | "color";
    unreadItems?: number;
    isExternal?: boolean;
  }>();

  const hooks = {
    menu: useLeftMenu(),
  };
</script>

<template>
  <CLink
    display="flex"
    as="RouterLink"
    variant="side-menu"
    :to="props.url"
    :bg="$route.path === props.url ? 'whiteAlpha.300' : ''"
    :color="$route.path === props.url ? 'white' : ''"
    align-items="center"
    justify-content="space-between"
  >
    <CFlex gap="3" align-items="center">
      <CIcon
        :name="props.iconName"
        v-bind:[props.iconColorProp]="$route.path === props.url ? 'white' : 'blue.100'"
        font-size="2xl"
      />
      <chakra.span v-if="hooks.menu.isFullWidth.value">{{ props.label }}</chakra.span>
    </CFlex>

    <CFlex
      v-if="props.unreadItems"
      bg="whiteAlpha.400"
      px="2"
      border-radius="5"
      color="white"
    >
      {{ props.unreadItems }}
    </CFlex>
  </CLink>

</template>
