<script setup lang="ts">
  const props = defineProps<{
    tabKeys: string[];
    selected?: string;
  }>();

  const state = {
    tabKeySelected: ref<string>(props.selected ?? props.tabKeys[0]),
  };
  
  watch(() => props.selected, (selectedNew: string) => {
    state.tabKeySelected.value = selectedNew ?? state.tabKeySelected.value;
  });

  function isSelected(tabKey: string) {
    return state.tabKeySelected.value === tabKey;
  }
</script>

<template>
  <CVStack class="c-tabs" w="100%">

    <CFlex class="c-tabs-select">

      <CFlex
        justify="space-between"
        align="center"
        w="100%"
      >
        <CFlex>
          <CButton
            v-for="tabKey in props.tabKeys"
            :key="tabKey"
            @click="state.tabKeySelected.value = tabKey"
            size="lg"
            variant="ghost"
            :color="isSelected(tabKey) ? 'blue.500' : 'black'"
            border-bottom="4px solid"
            :border-bottom-color="isSelected(tabKey) ? 'blue.500 !important' : 'gray.200'"
            border-radius="0"
            :font-weight="isSelected(tabKey) ? 'bold' : 'normal'"
            text-transform="capitalize"
            px="4"
            :_hover="{
              borderBottomColor: 'gray.300',
            }"
          >
            {{ tabKey }}
          </CButton>
        </CFlex>

        <CFlex>
          <CFlex
            v-for="tabKey in props.tabKeys"
            :key="tabKey"
          >
            <slot
              v-if="state.tabKeySelected.value === tabKey"
              :name="`${tabKey}-header-side`"
            />
          </CFlex>
        </CFlex>
      </CFlex>

    </CFlex>

    <CFlex class="c-tabs-items" direction="column">
      <CFlex :key="tabKey" v-for="tabKey in props.tabKeys">
        <slot v-if="state.tabKeySelected.value === tabKey" :name="tabKey" />
      </CFlex>
    </CFlex>

  </CVStack>
</template>
