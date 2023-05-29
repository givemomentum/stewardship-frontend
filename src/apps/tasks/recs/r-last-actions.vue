<script lang="ts" setup>
  import { marked } from "marked";
  import { CrmAction } from "~/apps/letters/interfaces";
  import { format } from "~/utils";

  const props = defineProps<{
    actions: CrmAction[];
  }>();

  const state = {
    isAllActionsVisible: ref(false),
    actionDescFullIndexes: ref<number[]>([]),
  };

  const comp = {
    actionDescShortList: computed(() => props.actions.map(action => {
      if (action.description.length <= 80) {
        return action.description;
      }
      const descShort = action.description.slice(0, 80);
      return `${descShort} ...`;
    })),
    actionDescFullList: computed(() => props.actions.map(
      action => {
        const descWithNewlines = action.description.replaceAll("\r\n", "<br/>");
        if (descWithNewlines.endsWith("<br/>")) {
          return descWithNewlines.slice(0, -5);
        }
        return descWithNewlines;
      },
    )),
  };
</script>

<template>

  <CFlex v-if="props.actions.length" gap="6" direction="column">

    <CFlex direction="column" w="100%" gap="6">

      <CFlex
        direction="column"
        v-for="(action, actionIndex) in (state.isAllActionsVisible.value ? props.actions : props.actions.slice(0, 3))"
        :key="action.pk"
        gap="1"
      >
        <CFlex justify="space-between">
          <CFlex
            text-transform="capitalize"
            font-weight="bold"
          >
            {{ action.category ?? 'Other' }}
          </CFlex>
          <CFlex color="gray.500">{{ format.date(action.action_created_at) }}</CFlex>
        </CFlex>
        <CFlex v-if="action.title">
          {{ action.title }}
        </CFlex>

        <CFlex
          v-if="action.description"
          align="center"
        >
          <CFlex
            direction="column"
            class="desc-full"
            v-if="state.actionDescFullIndexes.value.includes(actionIndex)"
            v-html="marked.parse(comp.actionDescFullList.value[actionIndex])"
            bg="gray.50"
            p="2"
            border-radius="lg"
          />
          <CBox v-else>
            <chakra.span class="desc-short" v-html="comp.actionDescShortList.value[actionIndex]" />
            <CButton
              display="flex-inline"
              v-if="!state.actionDescFullIndexes.value.includes(actionIndex) && action.description.length > 80"
              @click="state.actionDescFullIndexes.value.push(actionIndex)"
              variant="ghost"
              size="sm"
              font-weight="normal"
              h="fit-content"
              px="2"
            >
              More
            </CButton>
          </CBox>
        </CFlex>
      </CFlex>

    </CFlex>

    <CButton
      v-if="props.actions.slice(3).length && !state.isAllActionsVisible.value"
      @click="state.isAllActionsVisible.value = true"
      variant="outline"
      size="sm"
      color-scheme="gray"
      w="fit-content"
    >
      View {{ props.actions.slice(3).length }} more
    </CButton>

  </CFlex>

</template>

<style lang="scss">
  .desc-short {
    * {
      display: inline-block;
    }
    br {
      display: none;
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
    }
    hr {
      padding-bottom: 1rem;
    }
  }
</style>
