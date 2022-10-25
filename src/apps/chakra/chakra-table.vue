<script setup lang="ts">
  import { chakra } from "@chakra-ui/vue-next";

  const props = defineProps<{
    size?: "sm" | "md" | "lg";
  }>();
</script>

<template>
  <chakra.table :data-size="props.size ?? 'md'" class="table">
    <slot />
  </chakra.table>
</template>

<style lang="scss">
  .table {
    th {
      font-family: var(--fonts-heading);
      font-weight: var(--fontWeights-bold);
      text-transform: uppercase;
      line-height: var(--lineHeights-4);
      font-size: 0.65rem;
      color: var(--colors-gray-600);
      border-color: var(--colors-gray-200);
      border-bottom-width: 1px;
      text-align: start;
    }

    td {
      font-size: var(--fontSizes-sm);
      border-color: var(--colors-gray-200);
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

    $px: var(--space-6);
    $py-th: var(--space-4);
    $py: var(--space-4);

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

    $px: var(--space-4);
    $py-th: var(--space-2);
    $py: var(--space-3);

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
