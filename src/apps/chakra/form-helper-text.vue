<script lang="ts" setup>

  const props = defineProps<{ text: string }>();
</script>

<template>
  <CBox mt="2" color="gray.400" line-height="normal" font-size="0.8rem">
    {{ props.text }}
  </CBox>
</template>
