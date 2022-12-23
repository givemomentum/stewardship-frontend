<script lang="ts" setup>
  import { CFlex } from "@chakra-ui/vue-next";
  import { onMounted, ref, computed } from "vue";
  import { Recommendation, Task } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { urls } from "~/urls";
  import { useApi } from "~/composables/useApi";
  import { EmailBatch } from "~/apps/emails/interfaces";
  import { useRuntimeConfig } from "#app";

  const props = defineProps<{
    task: Task;
    title: string;
    columnsCount: string;
  }>();

  const state = {
    recOpen: ref<Recommendation | null>(null),
    emailBatch: ref(null as EmailBatch | null),
  };

  const hooks = {
    config: useRuntimeConfig(),
    tasks: useTaskListStore(),
    api: useApi(),
  };

  const comp = {
    sortedTasks: computed(() => {
      const sorted = props.task.rec_set.recs?.slice()?.sort((a, b) => {
        const a_dismissed = a.state === "dismissed";
        const b_dismissed = b.state === "dismissed";
        if (a_dismissed && !b_dismissed) {
          return 1;
        }
        if (!a_dismissed && b_dismissed) {
          return -1;
        }
        return a.pk - b.pk;
      });
      return sorted;
    }),
  };

  onMounted(async () => {
    if (props.task.rec_set?.email_batch) {
      const res = await hooks.api.get(`/emails/batches/${props.task.rec_set.email_batch}/`);
      state.emailBatch.value = res.data;
    }
    await hooks.tasks.loadRecsAndGiftHistory(props.task);
  });

  function toggleRecOpen(rec: Recommendation) {
    if (isCurrentRec(rec)) {
      state.recOpen.value = null;
    } else {
      state.recOpen.value = rec;
    }
  }

  function isCurrentRec(rec: Recommendation): boolean {
    return state.recOpen.value?.pk === rec.pk;
  }

  async function toggleRecCompletedStatus(rec: Recommendation) {
    if (rec.state === "completed") {
      rec.state = "new";
    } else {
      rec.state = "completed";
    }
    await hooks.tasks.updateRecState(rec);
  }

  async function toggleRecDismissed(rec: Recommendation) {
    if (rec.state === "dismissed") {
      rec.state = "new";
    } else {
      rec.state = "dismissed";
    }
    await hooks.tasks.updateRecState(rec);
  }
</script>

<template>
  <CFlex
    v-if="props.task.rec_set?.recs?.length"
    direction="column"
    p="6"
    pt="3"
    gap="1"
  >

    <CFlex justify="space-between" align="center">
      <CHeading font-size="xl" font-weight="normal" color="gray.500">
        {{ props.title }}
      </CHeading>

      <NuxtLink
        :to="urls.emails.batches.edit(props.task.rec_set.email_batch)"
        v-if="props.task.rec_set?.email_batch">
        <CButton
          size="sm"
          left-icon="mail"
        >
          {{ state.emailBatch.value?.status === 'sent' ? 'Review sent emails' : 'Compose emails' }}
        </CButton>
      </NuxtLink>

      <NuxtLink
        :to="urls.letters.batchLettersList(props.task.rec_set.letter_batch)"
        v-else-if="props.task.rec_set?.letter_batch">
        <CButton
          size="sm"
          left-icon="mail"
        >
          Review letters
        </CButton>
      </NuxtLink>
      <CFlex gap="7" v-else>
        <VTooltip>
          <div>
            <CLink
              :href="`${hooks.config.public.apiBase}/recs/rec-sets/${props.task.rec_set?.pk}/donor-csv`"
            >
              <CButton left-icon="download" variant="link">CSV</CButton>
            </CLink>
          </div>
          <template v-slot:popper>
            <CText font-size="xs">Download as CSV</CText>
          </template>
        </VTooltip>
      </CFlex>

      <slot name="top-buttons" />
    </CFlex>

    <ChakraTable size="sm">
      <chakra.thead>
        <chakra.th w="0" />
        <slot name="table-headers" />
        <chakra.th
          v-if="props.task.rec_set.rule.is_show_dismiss_button_on_task"
          w="0"
        />
      </chakra.thead>

      <chakra.tbody>
        <template
          v-for="rec in comp.sortedTasks.value"
          :key="rec.pk"
        >

          <chakra.tr
            @click="toggleRecOpen(rec)"
            :_hover="{ cursor: 'pointer', bg: isCurrentRec(rec) ? 'white' : 'gray.50' }"
            :bg="isCurrentRec(rec) ? 'white' : 'inherit'"
            :opacity="rec.state === 'dismissed' ? '0.5' : '1'"
          >

            <chakra.td text-align="end !important">
              <CIcon
                @click.stop="toggleRecCompletedStatus(rec)"
                :name="rec.state === 'completed' ? 'io-checkmark-circle' : 'io-checkmark-circle-outline'"
                mb="px"
                :_hover="{ color: 'teal.300', fill: 'teal.300' }"
                transition="all 0.3s"
                size="21px"
                :color="rec.state === 'completed' ? 'teal.400' : 'gray.500'"
                :fill="rec.state === 'completed' ? 'teal.400' : 'gray.500'"
              />
            </chakra.td>

            <slot name="table-columns" :rec="rec" />

            <chakra.td
              v-if="props.task.rec_set.rule.is_show_dismiss_button_on_task"
              padding-left="0"
            >
              <CButton
                @click.stop="toggleRecDismissed(rec)"
                variant="ghost"
                size="xs"
                pl="0"
              >
                {{ rec.state == 'dismissed' ? 'Restore' : 'Dismiss' }}
              </CButton>
            </chakra.td>
          </chakra.tr>

          <chakra.tr
            :opacity="isCurrentRec(rec) ? 1 : 0"
            transition="all 0.2s"
            bg="white"
          >
            <chakra.td
              :colspan="props.columnsCount"
              border-bottom="0"
              :py="isCurrentRec(rec) ? 'inherit' : '0 !important'"
              :line-height="isCurrentRec(rec) ? 'inherit' : '0 !important'"
              transition="all 0.2s"
              w="fit-content"
            >
              <CFlex
                direction="column"
                :gap="isCurrentRec(rec) ? 5 : 0"
              >
                <CFlex v-if="rec.explanation" color="gray.600" font-size="sm">
                  Recommended because {{ rec.explanation }}
                </CFlex>

                <slot
                  name="rec-unfolded"
                  :rec="rec"
                  :is-current-rec="isCurrentRec(rec)"
                />

                <CFlex
                  direction="column"
                  v-if="rec.donor"
                  v-for="(data, fieldName) in rec.donor.custom_data"
                  :key="fieldName">
                  <CFlex color="gray.400" font-size="xs">{{ data["label"] }}</CFlex>
                  <CFlex font-size="md">{{ data["value"] }}</CFlex>
                </CFlex>

                <CFlex
                  direction="column"
                  v-if="rec.gift"
                  v-for="(data, fieldName) in rec.gift.custom_data"
                  :key="fieldName">
                  <CFlex color="gray.400" font-size="xs">{{ data["label"] }}</CFlex>
                  <CFlex font-size="md">{{ data["value"] }}</CFlex>
                </CFlex>

                <CFlex
                  direction="column"
                  v-if="rec.donor?.gifts?.filter(g => Number(g.amount))?.length"
                >
                  <CFlex color="gray.400" font-size="xs">Giving history</CFlex>
                  <RecDonorGiftChart
                    v-if="isCurrentRec(rec)"
                    :rec="rec"
                    :key="rec.pk"
                  />
                </CFlex>

              </CFlex>

            </chakra.td>
          </chakra.tr>

        </template>
      </chakra.tbody>
    </ChakraTable>

  </CFlex>
</template>

<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/styles/chakra-ui.scss';
</style>
