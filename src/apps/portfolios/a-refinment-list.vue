<script setup lang="ts">
import { CBox, CText, CButton, CBadge, CInput, CFormLabel } from "@chakra-ui/vue-next";

const props = defineProps<{
  attribute: string;
  searchable?: boolean;
  limit?: number;
  showMoreLimit?: number;
  mt?: number | string;
}>();
</script>

<template>
  <CBox p="3">
    <AisRefinementList
      :attribute="props.attribute"
      :searchable="props.searchable"
      :limit="props.limit"
      :show-more-limit="props.showMoreLimit"
    >
      <template
        v-slot="{
          items,
          isShowingMore,
          isFromSearch,
          canToggleShowMore,
          refine,
          createURL,
          toggleShowMore,
          searchForItems,
          sendEvent,
        }"
      >
        <CInput
          v-if="props.searchable"
          placeholder="Filter..."
          size="sm"
          @input="searchForItems($event.currentTarget.value)"
          mb="2"
          border-radius="md"
        />

        <chakra.ul mt="1px">
          <li v-if="isFromSearch && !items.length">No results.</li>
            <li v-for="item in items" :key="item.value">
              <CCheckbox
                @update:model-value="() => refine(item.value)"
              >
                <CText font-size="0.95rem" :_hover="{ color: 'blue.500' }">
                  <ais-highlight v-if="props.searchable" attribute="item" :hit="item" />
                  <CText v-else>{{ item.value.replace('_', ' ') }}</CText>
                  <CBadge ml="1" mt="0" font-weight="normal" font-size="0.6rem">
                    {{ item.count.toLocaleString() }}
                  </CBadge>
                </CText>
              </CCheckbox>
            </li>
        </chakra.ul>

        <CButton size="sm" v-if="canToggleShowMore" @click="toggleShowMore">
          {{ !isShowingMore ? "Show more" : "Show less" }}
        </CButton>
      </template>
    </AisRefinementList>
  </CBox>
</template>
