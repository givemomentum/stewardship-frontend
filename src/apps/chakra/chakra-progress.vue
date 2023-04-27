<script lang="ts" setup>
  const props = defineProps<{
    value: number;
    bg?: string;
    h?: string;
  }>();
</script>

<template>
  <CBox
    :h="props.h ?? 3"
    overflow="hidden"
    pos="relative"
    bg="gray.100"
    border-radius="sm"
  >
    <CBox
      :w="`${props.value}%`"
      h="100%"
      :bg="props.bg ?? 'blue.500'"
    />
  </CBox>
</template>
