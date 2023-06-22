<script lang="ts" setup>
const props = defineProps<{
  donorId: string | number;
  planId: string | number;
}>();

const hooks = {
  api: useApi(),
  notify: useNotify(),
};

const state = {
  showInput: ref(false),
};
</script>

<template>
  <CBox w="100%">
    <PLogCall
      v-if="state.showInput.value"
      :hide-header="true"
      :on-close="() => (state.showInput.value = false)"
      :donorId="props.donorId"
      :planId="props.planId"
    />
    <CButton @click="state.showInput.value = true" v-if="!state.showInput.value"
      >Log call or email</CButton
    >
  </CBox>
</template>

<style lang="scss">
.p-donor-detail-table {
  td {
    padding: 0.5rem;
    padding-right: 1.2rem;

    &:first-child {
      padding-left: 0;
      font-weight: bold;
      color: var(--chakra-colors-gray-500);
    }
  }
}
.desc-full {
  blockquote {
    border-left: 4px solid #e2e8f0;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
  }
  p {
    padding-bottom: 1rem;
    &:last-of-type {
      padding-bottom: 0;
    }
  }
  hr {
    padding-bottom: 1rem;
  }
}
</style>
