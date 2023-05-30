<script lang="ts" setup>
  import { parseISO } from "date-fns";
  import { marked } from "marked";
  import { ChartDataItem, ChartSeries } from "~/apps/shared/interfaces";
  import { urls } from "~/urls";
  import { format, giftsToSeries } from "~/utils";
  import { CrmAction, CrmGift, CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    donorId: string | number;
    isSkipAction?: boolean;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    nextRec: ref<{ scheduled_for: string; id?: Number } | null>(null),
    donor: ref<CrmDonor | null>(null),
    actions: ref<CrmAction[]>([]),
    giftSeries: ref<ChartDataItem[] | null>(null),
    giftSeriesAll: ref<ChartDataItem[] | null>(null),
    householdMembers: ref<CrmDonor[] | null>(null),
    donorColorMap: ref<{ [key: string]: string }>({}),
  };

  onMounted(async () => {
    hooks.api.get(`/crms/donors/${props.donorId}/?expand=household`).then((res) => {
      state.donor.value = res.data;

      let giftSeries: ChartDataItem[] = [];
      const isHousehold = res.data.household.donors.length > 1;
      for (const donor of res.data.household.donors) {
        giftSeries = giftSeries.concat(
          donor.gifts.map(gift => ({
            x: parseISO(gift.date).getTime(),
            y: Number(gift.amount),
            fillColor: isHousehold ? getDonorColor(donor.name) : "#4299e1",
            label: donor.name,
          }))
        );
        giftSeries = giftSeries.sort((a, b) => a.x - b.x);
      }
      state.giftSeries.value = giftSeries.slice(-25);
      state.giftSeriesAll.value = giftSeries;

      if (res.data.household.donors.length > 1) {
        state.householdMembers.value = res.data.household.donors
          .filter(donor => donor.pk != res.data.pk);
      }
    });
    hooks.api.get(`/portfolios/${props.donorId}/next-rec`).then((res) => {
      state.nextRec.value = res.data;
    });
    hooks.api.get(`/crms/actions/?donor=${props.donorId}`).then((res) => {
      state.actions.value = res.data;
    });
  });

  function getDonorColor(donorName: string): string {
    // gpt code
    const colors = ["#ed64a6", "#48bb78", "#f6ad55", "#ed64a6"]

    if (donorName === state.donor.value.name) {
        state.donorColorMap.value[donorName] = "#4299e1";
        return "#4299e1";
    }

    if (state.donorColorMap.value[donorName]) {
        return state.donorColorMap.value[donorName];
    }

    let hash = 0;
    for (let i = 0; i < donorName.length; i++) {
        hash = donorName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash into a positive index value and use it to get a color
    const index = Math.abs(hash) % colors.length;
    const color = colors[index];

    state.donorColorMap.value[donorName] = color;

    return color;
  }

  async function getNextRec() {
    const res = await hooks.api.get(`/portfolios/${props.donorId}/next-rec`)
    state.nextRec.value = res.data;
  }
</script>

<template>
  <CFlex
    p="6"
    pr="10"
    direction="column"
    gap="9"
  >
    <CFlex align="center" justify="space-between">
      <CHeading size="lg">
        {{ state.donor.value?.name }}
      </CHeading>
      <CLink
        :href="state.donor.value?.crm_url"
        is-external
      >
        <CButton
          right-icon="external-link"
          variant="outline"
          color-scheme="gray"
        >
          <!-- Workaround for Donor Perfect link issue: Show Donor Id, so she can copy it.-->
          {{
            state.donor.value?.source == "donor_perfect" ? state.donor.value?.source_id : "CRM Profile"
          }}
        </CButton>
      </CLink>
    </CFlex>

    <CFlex justify="space-between" h="fit-content">
      <CTable variant="unstyled" class="p-donor-detail-table" w="fit-content" h="fit-content">
        <CTr v-if="state.nextRec.value">
          <CTd>Next touch</CTd>
          <CTd>
            <PDateInput
              :date-initial="state.nextRec.value.scheduled_for"
              :api-path="`/portfolios/${props.donorId}/schedule-for`"
              :serializer="(date: string) => ({
                date: date,
              })"
              :label="format.date(state.nextRec.value.scheduled_for)"
              @model-updated="() => {
                state.nextRec.value.scheduled_for = $event;
                getNextRec();
              }"
              :success-message="(date: string) => `We won't recommend this donor until ${date}`"
              cta="Schedule"
              :is-auto-tag="!state.nextRec.value.id"
            />
          </CTd>
        </CTr>

        <CTr>
          <CTd>Next gift</CTd>
          <CTd>
            <PDateInput
              v-if="state.donor.value"
              :date-initial="state.donor.value.expected_gift_date"
              :api-path="`/crms/donors/${state.donor.value.pk}/`"
              :serializer="(date: string) => ({
                is_expected_gift_date_user_set: true,
                expected_gift_date: date,
              })"
              :label="format.date(state.donor.value.expected_gift_date)"
              @model-updated="state.donor.value.expected_gift_date = $event"
              :success-message="(date) => `Next gift date updated`"
            />
          </CTd>
        </CTr>

        <CTr v-if="state.donor.value?.last_gift_amount">
          <CTd>
            Last gift
          </CTd>

          <CTd>
            {{ format.money(state.donor.value?.last_gift_amount) }} on
            {{ format.date(state.donor.value?.last_gift_date) }}
          </CTd>
        </CTr>

        <CTr v-if="state.donor.value?.donated_total">
          <CTd>
            Lifetime
          </CTd>

          <CTd>
            {{ format.money(state.donor.value.donated_total) }}
          </CTd>
        </CTr>

        <CTr v-if="state.donor.value?.giving_since">
          <CTd>
            Giving since
          </CTd>

          <CTd>
            {{ format.date(state.donor.value.giving_since) }}
          </CTd>
        </CTr>
      </CTable>

      <CBox v-if="state.donor.value">
        <CFlex direction="column">
          <CFlex
            v-if="state.donor.value.email"
            :py="{ base: 1, '2xl': 2 }"
            align="center"
            gap="2"
            white-space="nowrap"
          >
            <CIcon size="5" color="gray.500" name="email" />
            {{ state.donor.value.email }}
          </CFlex>

          <CFlex
            v-if="state.donor.value.phone_number"
            :py="{ base: 1, '2xl': 2 }"
            align="center"
            gap="2"
            white-space="nowrap"
          >
            <CIcon size="5" fill="gray.500" name="io-call" />
            {{ state.donor.value.phone_number }}
          </CFlex>

          <CFlex
            v-if="state.donor.value?.mailing_address?.city"
            :py="{ base: 1, '2xl': 2 }"
            align="center"
            gap="2"
            white-space="nowrap"
          >
            <CIcon size="5" fill="gray.500" name="fa-map-marker-alt" />
            {{ state.donor.value?.mailing_address.city }},
            {{ state.donor.value?.mailing_address.state }}
          </CFlex>
        </CFlex>
      </CBox>
    </CFlex>

    <CFlex
      v-if="state.donor.value?.household?.description"
      direction="column"
      gap="2"
    >
      <CHeading font-size="2xl" color="gray.500">
        Description
      </CHeading>

      <CText
        class="desc-full"
        v-html="marked.parse(state.donor.value?.household?.description)"
      />
    </CFlex>

    <CFlex
      v-if="state.householdMembers.value"
      direction="column"
      gap="2"
    >
      <CHeading font-size="2xl" color="gray.500">
        Household
      </CHeading>

      <CTable
        variant="unstyled"
        class="p-donor-detail-table"
        w="fit-content"
        h="fit-content"
      >
        <CTr
          v-for="member in state.householdMembers.value"
          :key="member?.id"
        >
          <CTd>
            {{ member.name }}
          </CTd>

          <CTd>
            <CFlex align="center" gap="2">
              {{ member.email || member.phone_number }}

              <CLink
                v-if="member.portfolio_plan_id"
                :href="urls.portfolios.donor(member.portfolio_plan_id, member.id)"
              >
                <CButton size="xs" variant="outline" color-scheme="gray" pt="1px">View</CButton>
              </CLink>

              <CLink :href="member.crm_url">
                <CButton
                  size="xs"
                  variant="outline"
                  color-scheme="gray"
                  right-icon="external-link"
                  pt="1px"
                >
                  CRM
                </CButton>
              </CLink>
            </CFlex>
          </CTd>
        </CTr>
      </CTable>
    </CFlex>

    <CFlex gap="3" direction="column">
      <CHeading font-size="2xl" color="gray.500">
        Giving History
      </CHeading>

      <CText
        v-if="state.giftSeriesAll.value?.length > state.giftSeries.value?.length"
        color="gray.500"
        font-size="sm"
      >
        Showing last 25 gifts
      </CText>

      <AreaChart
        v-if="state.giftSeries.value"
        :series="[{ data: state.giftSeries.value, name: '' }]"
      />
    </CFlex>

    <CFlex gap="5" direction="column">
      <CHeading font-size="2xl" color="gray.500">
        Last actions
      </CHeading>
      <RLastActions v-if="state.actions.value?.length" :actions="state.actions.value" />
    </CFlex>

  </CFlex>
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
