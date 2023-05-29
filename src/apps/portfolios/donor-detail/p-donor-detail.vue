<script lang="ts" setup>
  import { format } from "~/utils";
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
    gifts: ref<CrmGift[]>([]),
  };

  onMounted(async () => {
    hooks.api.get(`/crms/donors/${props.donorId}/`).then((res) => {
      state.donor.value = res.data;
    });
    hooks.api.get(`/portfolios/${props.donorId}/next-rec`).then((res) => {
      state.nextRec.value = res.data;
    });
    hooks.api.get(`/crms/actions/?donor=${props.donorId}`).then((res) => {
      state.actions.value = res.data;
    });
    hooks.api.get(`/crms/gifts/?donor=${props.donorId}`).then((res) => {
      state.gifts.value = res.data;
    });
  });

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

    <CBox>
      <CHeading font-size="2xl" color="gray.500">
        Giving History
      </CHeading>

      <PGivingHistory
        v-if="state.gifts.value?.length"
        :donor-name="state.donor.value?.name"
        :gifts="state.gifts.value"
      />
    </CBox>

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
</style>
