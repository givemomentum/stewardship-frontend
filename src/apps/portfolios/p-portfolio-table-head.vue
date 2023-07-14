<script setup lang="ts">
  import { SortAttribute, useAlgolia } from "~/apps/portfolios/useAlgolia";

  const props = defineProps<{
    attribute: SortAttribute;
    label?: string;
  }>();

  const hooks = {
    algolia: useAlgolia(),
  };
</script>

<template>
  <CTh
    @click="hooks.algolia.toggleSortBy(props.attribute)"
    :_hover="{cursor: 'pointer', bg: 'gray.100'}"
    pos="relative"
    user-select="none"
  >
    <CIcon
      v-if="hooks.algolia.sortByAttribute.value === props.attribute"
      pos="absolute"
      left="1"
      top="9px"
      name="chevron-down"
      size="5"
      color="gray.500"
      :transform="hooks.algolia.sortOrder.value === 'desc' ? 'rotate(180deg)' : ''"
    />
    {{ props.label }}
  </CTh>
</template>
