<script setup lang="ts">

  const props = defineProps<{
    size?: "sm" | "md" | "lg";
  }>();
</script>

<template>
  <table :data-size="props.size ?? 'md'" class="table">
    <slot />
  </table>
</template>

<style lang="scss">
  .table {
    th {
      font-family: var(--chakra-fonts-heading);
      font-weight: var(--chakra-fontWeights-bold);
      text-transform: uppercase;
      line-height: var(--chakra-lineHeights-4);
      font-size: 0.65rem;
      color: var(--chakra-colors-gray-600);
      border-color: var(--chakra-colors-gray-200);
      border-bottom-width: 1px;
      text-align: start;
    }

    td {
      font-size: var(--chakra-fontSizes-sm);
      border-color: var(--chakra-colors-gray-200);
      border-bottom-width: 1px;
      text-align: start;
    }

    th, td {
      &[data-is-numeric=true] {
        text-align: right;
      }
    }
  }

  table[data-size=md] {
    @extend .table;

    $px: var(--chakra-space-6);
    $py-th: var(--chakra-space-4);
    $py: var(--chakra-space-4);

    th {
      padding-inline-start: $px;
      padding-inline-end: $px;
      padding-top: $py-th;
      padding-bottom: $py-th;
    }

    td {
      padding-inline-start: $px;
      padding-inline-end: $px;
      padding-top: $py;
      padding-bottom: $py;
    }
  }

  table[data-size=sm] {
    @extend .table;

    $px: var(--chakra-space-4);
    $py-th: var(--chakra-space-2);
    $py: var(--chakra-space-3);

    th {
      padding-inline-start: $px;
      padding-inline-end: $px;
      padding-top: $py-th;
      padding-bottom: $py-th;
    }

    td {
      padding-inline-start: $px;
      padding-inline-end: $px;
      padding-top: $py;
      padding-bottom: $py;
    }
  }
</style>
