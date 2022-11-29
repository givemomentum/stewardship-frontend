<script lang="ts" setup>
  import { useRuntimeConfig } from "#app";
  import { useApi } from "#imports";
  import { CFlex, CBox, useClipboard } from "@chakra-ui/vue-next";
  import { onMounted, ref, watch } from "vue";
  import { Recommendation, Task } from "~/apps/tasks/interfaces";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { formatMoney, format } from "~/utils";
  import { parseISO } from "date-fns";

  const props = defineProps<{ task: Task; }>();

  const state = {
    recOpen: ref<Recommendation | null>(null),
    giftSeries: ref<{ x: number, y: number }[]>([{ x: 5, y: 5 }]),
    donorCopyData: ref<string>(""),
    copyTooltip: ref("Copy full name & address")
  };

  const hooks = {
    tasks: useTaskListStore(),
    api: useApi(),
    clipboard: useClipboard({ source: state.donorCopyData }),
    config: useRuntimeConfig(),
  };

  onMounted(async () => {
    await hooks.tasks.loadTaskGiftsHistory(props.task);
  });

  watch(state.recOpen, (recNew?: Recommendation) => {
    if (!recNew) {
      return;
    }

    if (recNew?.donor?.gifts) {
      state.giftSeries.value = recNew.donor.gifts
        .filter(gift => Number(gift.amount))
        .map(gift => (
          {
            x: parseISO(gift.date).getTime(),
            y: Number(gift.amount),
          }
        ));
    }
  });

  function isCurrentRec(rec: Recommendation) {
    return state.recOpen.value?.pk === rec.pk;
  }

  function clickRec(rec: Recommendation) {
    if (isCurrentRec(rec)) {
      state.recOpen.value = null;
    } else {
      state.recOpen.value = rec;
    }
  }

  async function toggleRecCompletedStatus(rec: Recommendation) {
    rec.is_completed = !rec.is_completed;
    await hooks.tasks.updateRecommendationCompletedStatus(rec);
  }

  const chartOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: 280,
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: amount => format.money(amount),
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: amount => format.money(amount),
      },
      x: {
        formatter: (date: number) => format.dateFromUnix(date),
      },
    },
  };
  
  function copyDonorInfo(rec: Recommendation) {
    state.donorCopyData.value = rec.donor.letter_label;
    hooks.clipboard.copy();
    state.copyTooltip.value = "Copied";
    setTimeout(() => {
      state.copyTooltip.value = "Copy full name & address";
    }, 1500);
  }
</script>

<template>
  <CFlex gap="1" direction="column">
    <CBox p="6" pt="4" bg="white" border="1px solid" border-color="gray.100">
      <TaskHead :task="props.task" size="xl" font-weight="bold" />
    </CBox>

    <CFlex v-if="props.task.recommendation_set?.recommendations?.length" direction="column" p="6" pt="3" gap="1">

      <CFlex justify="space-between">
        <CHeading font-size="xl" font-weight="normal" color="gray.500">Gifts</CHeading>
        <CFlex gap="7">
          <VTooltip>
            <div>
              <CLink
                :href="`${hooks.config.public.apiBase}/recs/recommendation-sets/${props.task.recommendation_set?.pk}/donor-csv`">
                <CButton left-icon="download" variant="link">CSV</CButton>
              </CLink>
            </div>

            <template #popper>
              <CText font-size="xs">Download letter labels</CText>
            </template>
          </VTooltip>
        </CFlex>
      </CFlex>

      <ChakraTable>
        <chakra.thead>
          <chakra.th>Name</chakra.th>
          <chakra.th>Amount</chakra.th>
          <chakra.th>Gift Date</chakra.th>
          <chakra.th>Lifetime Gifts</chakra.th>
          <chakra.th>First gift</chakra.th>
          <chakra.th />
          <chakra.th />
          <!--          <chakra.th>Completed</chakra.th>-->
        </chakra.thead>

        <chakra.tbody>
          <template
            v-for="rec in props.task.recommendation_set.recommendations"
            :key="rec.pk"
          >

            <chakra.tr
              @click="clickRec(rec)"
              :_hover="{ cursor: 'pointer', bg: isCurrentRec(rec) ? 'white' : 'gray.50' }"
              :bg="isCurrentRec(rec) ? 'white' : 'inherit'"
            >
              <chakra.td v-if="rec.donor.name">{{ rec.donor.name }}</chakra.td>
              <chakra.td v-else>No name provided</chakra.td>
              <chakra.td>{{ formatMoney(rec.gift.amount) }}</chakra.td>
              <chakra.td>{{ format.dateHuman(rec.gift.date) }}</chakra.td>
              <chakra.td>{{ formatMoney(rec.donor.donated_total) }}</chakra.td>
              <chakra.td>{{ format.dateMonth(rec.donor.giving_since) }}</chakra.td>

              <chakra.td>
                <VTooltip placement="top" :key="state.copyTooltip.value">
                  <div>
                    <CIconButton
                      @click.stop="() => copyDonorInfo(rec)"
                      size="sm"
                      variant="link"
                      icon="copy"
                      ariaLabel="copy"
                    />
                  </div>

                  <template #popper>
                    <CText font-size="xs">{{state.copyTooltip.value}}</CText>
                  </template>
                </VTooltip>
              </chakra.td>

              <chakra.td text-align="end !important">
                <ChakraCheckbox
                  :model-value="rec.is_completed"
                  @update:model-value="toggleRecCompletedStatus(rec)"
                />
              </chakra.td>
            </chakra.tr>

            <chakra.tr
              :opacity="isCurrentRec(rec) ? 1 : 0"
              transition="all 0.2s"
              bg="white"
            >
              <chakra.td
                colspan="7"
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
                  <CFlex direction="column">
                    <CFlex color="gray.400" font-size="xs">Biggest gift</CFlex>
                    <CFlex font-size="md">{{ format.money(rec.donor.donation_biggest) }}</CFlex>
                  </CFlex>
                  <CFlex direction="column" v-if="rec.donor.email">
                    <CFlex color="gray.400" font-size="xs">Email</CFlex>
                    <CFlex font-size="md">{{ rec.donor?.email }}</CFlex>
                  </CFlex>
                  <CFlex direction="column" v-if="rec.donor?.phone?.number">
                    <CFlex color="gray.400" font-size="xs">Phone</CFlex>
                    <CFlex font-size="md">{{ rec.donor?.phone?.number }}</CFlex>
                  </CFlex>

                  <CFlex direction="column">
                    <CFlex color="gray.400" font-size="xs">Address</CFlex>
                    <CFlex
                      v-if="rec.donor.mailing_address?.one_line"
                      font-size="md"
                    >
                      {{ rec.donor.mailing_address?.one_line }}
                    </CFlex>
                    <CFlex v-else font-size="md">−</CFlex>
                  </CFlex>

                  <CFlex v-if="rec.gift.notes" direction="column">
                    <CFlex color="gray.400" font-size="xs">Notes</CFlex>
                    <CFlex font-size="md">{{ rec.gift.notes }}</CFlex>
                  </CFlex>

                  <CFlex direction="column">
                    <CFlex color="gray.400" font-size="xs">Giving history</CFlex>
                    <apexchart
                      v-if="isCurrentRec(rec)"
                      width="780"
                      height="250"
                      type="area"
                      :options="chartOptions"
                      :series="[{
                        name: 'Amount',
                        data: state.giftSeries.value,
                      }]"
                    />
                  </CFlex>

                </CFlex>

              </chakra.td>
            </chakra.tr>

          </template>
        </chakra.tbody>
      </ChakraTable>

    </CFlex>

    <CBox p="6" pt="0" bg="gray.75">
      <CHeading
        v-if="props.task.recommendation_set?.recommendations?.length && props.task.comments_count"
        font-size="xl"
        font-weight="normal"
        mt="-1"
        color="gray.500"
      >
        Comments
      </CHeading>
      <TaskComments :task="props.task" />
    </CBox>
  </CFlex>
</template>

<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/styles/chakra-ui.scss';
  //noinspection CssUnknownTarget
  @import '~/styles/formkit.scss';
</style>
