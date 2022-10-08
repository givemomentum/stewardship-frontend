<script lang="ts" setup>
  import { CBreadcrumb, CIcon, CBreadcrumbItem } from "@chakra-ui/vue-next";

  const props = defineProps<{
    items: BreadcrumbItem[];
  }>();

  interface BreadcrumbItem {
    label: string;
    url?: string;
    isCurrentPage?: boolean;
  }
</script>

<template>
  <CBreadcrumb mt="2">
    <template v-slot:separator>
      <CIcon name="chevron-right" color="gray.400" h="5" w="5" />
    </template>

    <!-- it literally doesn't work with v-for. feel free to try, it's a free country -->
    <CBreadcrumbItem
      v-if="props.items[0]"
      :color="props.items[0].isCurrentPage ? '' : 'gray.400'"
      :is-current-page="props.items[0].isCurrentPage"
    >
      <NuxtLink :href="props.items[0].url">
        {{ props.items[0].label }}
      </NuxtLink>
    </CBreadcrumbItem>

    <CBreadcrumbItem
      v-if="props.items[1]"
      :color="props.items[1].isCurrentPage ? '' : 'gray.400'"
      :is-current-page="props.items[1].isCurrentPage"
    >
      <NuxtLink :href="props.items[1].url">
        {{ props.items[1].label }}
      </NuxtLink>
    </CBreadcrumbItem>

    <CBreadcrumbItem
      v-if="props.items[2]"
      :color="props.items[2].isCurrentPage ? '' : 'gray.400'"
      :is-current-page="props.items[2].isCurrentPage"
    >
      <NuxtLink :href="props.items[2].url">
        {{ props.items[2].label }}
      </NuxtLink>
    </CBreadcrumbItem>
  </CBreadcrumb>
</template>
