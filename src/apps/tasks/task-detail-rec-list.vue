<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { Rec, Task } from "~/apps/tasks/interfaces";
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
    recOpen: ref<Rec | null>(null),
    emailBatch: ref(null as EmailBatch | null),
  };

  const hooks = {
    config: useRuntimeConfig(),
    tasks: useTaskListStore(),
    api: useApi(),
  };

  onMounted(async () => {
    if (props.task.rec_set?.email_batch) {
      const res = await hooks.api.get(`/emails-new/batches/${props.task.rec_set.email_batch}/`);
      state.emailBatch.value = res.data;
    }
    await hooks.tasks.loadRecsAndGiftHistory();
  });

  function isCurrentRec(rec: Rec): boolean {
    return state.recOpen.value?.pk === rec.pk;
  }

  function openRec(rec: Rec) {
    hooks.tasks.recOpened.value = rec;
    navigateTo(urls.tasks.detailRec(props.task.slug, rec.slug));
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
        :to="urls.letters.batchLettersList(props.task.rec_set.letter_batch)"
        v-if="props.task.rec_set?.letter_batch"
      >
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
      </chakra.thead>

      <chakra.tbody>
        <template
          v-for="rec in props.task.rec_set.recs"
          :key="rec.pk"
        >

          <chakra.tr
            @click="openRec(rec)"
            :_hover="{ cursor: 'pointer', bg: isCurrentRec(rec) ? 'white' : 'gray.50' }"
            :bg="isCurrentRec(rec) ? 'white' : 'inherit'"
            :color="rec.state === 'dismissed' ? 'gray.400' : ''"
            :text-decoration="rec.state === 'dismissed' ? 'line-through' : ''"
          >

            <chakra.td text-align="center !important">
              <CIcon
                v-if="rec.state === 'completed' || rec.state === 'new' || rec.state === 'skipped_as_already_handled'"
                :name="(rec.state === 'completed' || rec.state === 'skipped_as_already_handled') ? 'io-checkmark-circle' : 'io-checkmark-circle-outline'"
                mb="px"
                size="21px"
                :color="(rec.state === 'completed' || rec.state === 'skipped_as_already_handled') ? 'teal.400' : 'gray.500'"
                :fill="(rec.state === 'completed' || rec.state === 'skipped_as_already_handled') ? 'teal.400' : 'gray.500'"
              />
              <CIcon
                v-if="rec.state?.startsWith('skipped_to')"
                name="bi-clock"
                mb="px"
                size="18px"
                :color="rec.state === 'completed' ? 'teal.400' : 'gray.500'"
                :fill="rec.state === 'completed' ? 'teal.400' : 'gray.500'"
              />
              <CIcon
                v-if="rec.state === 'skipped_as_unqualified'"
                name="x"
                mb="px"
                size="18px"
                :color="rec.state === 'completed' ? 'teal.400' : 'gray.500'"
                :fill="rec.state === 'completed' ? 'teal.400' : 'gray.500'"
              />
            </chakra.td>

            <chakra.td
              v-if="props.task.rec_set.rule.is_show_follow_up_button_on_task"
              padding-left="0"
            >
              <VTooltip>
                <div>
                  <CIcon
                    @click.stop="toggleRecFollowUp(rec)"
                    :name="rec.is_follow_up_needed ? 'bi-clock-fill' : 'bi-clock'"
                    size="21px"
                    mb="px"
                    :fill="rec.is_follow_up_needed ? 'teal.400' : 'gray.500'"
                  />
                </div>
                <template v-slot:popper>
                  <CText font-size="xs">{{
                    rec.is_follow_up_needed ? 'Remove the follow up' : 'Follow up later'
                  }}
                  </CText>
                </template>
              </VTooltip>
            </chakra.td>

            <slot name="table-columns" :rec="rec" />

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
                  v-for="(data, fieldName) in rec.donor?.custom_data"
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

              </CFlex>

            </chakra.td>
          </chakra.tr>

        </template>
      </chakra.tbody>
    </ChakraTable>

  </CFlex>
</template>
