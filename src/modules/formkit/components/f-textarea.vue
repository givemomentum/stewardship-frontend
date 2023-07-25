<script setup lang="ts">
  const props = defineProps({
    context: Object,
  });
</script>

<template>
  <NuxtCkeditor
    :model-value="props.context._value"
    @update:model-value="props.context.node.input($event)"
  />
</template>
