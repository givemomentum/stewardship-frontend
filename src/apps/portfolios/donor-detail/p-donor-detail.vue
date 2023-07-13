<script lang="ts" setup>
  import { NuxtLink } from "#components";
  import { marked } from "marked";
  import { TouchRec } from "~/apps/portfolios/interfaces";
  import { usePlanDonorLoader } from "~/apps/portfolios/usePlanDonorLoader";
  import { urls } from "~/urls";
  import { format } from "~/utils";
  import { CrmAction, CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    planId: string | number;
    donorId: string | number;
    isEnableDonorContactMode?: any;
    p?: any;
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
    loader: usePlanDonorLoader(props.donorId, props.planId),
  };

  const state = {
    donor: ref(null as CrmDonor | null),
    recPending: ref(null as TouchRec | null),
    nextRecScheduled: ref(null as { scheduled_for: string; id?: Number } | null),
    actions: ref<CrmAction[]>([]),
    householdMembers: ref(null as CrmDonor[] | null),
    isActionLoading: ref(false),
  };

  onMounted(async () => {
    hooks.api.get(`/crms/donors/${props.donorId}/?expand=household,donor_intels`).then(res => {
      state.donor.value = res.data;

      const isHousehold = res.data.household?.donors?.length ?? 0 > 1;
      if (isHousehold > 1) {
        state.householdMembers.value = res.data.household.donors.filter(
          donor => donor.pk != res.data.pk
        );
      }
    });
    hooks.api.get(`/crms/actions/?donor=${props.donorId}`).then(res => {
      state.actions.value = res.data;
    });
    getNextRecScheduled();
    hooks.api.getJson(`/portfolios/${props.planId}/donors/${props.donorId}/rec-pending`).then(data => {
      state.recPending.value = data;
    });
  });

  async function getNextRecScheduled() {
    const res = await hooks.api.get(`/portfolios/${props.donorId}/next-rec-scheduled`);
    state.nextRecScheduled.value = res.data;
  }

  async function removeFromPortfolio() {
    state.isActionLoading.value = true;
    await hooks.api.delete(`/portfolios/${props.planId}/donors/${props.donorId}/`);
    hooks.notify.send("Donor removed from portfolio");
    state.isActionLoading.value = false;
  }
</script>

<template>
  <CFlex
    :p="props.p ?? 6"
    pr="10"
    direction="column"
    gap="9"
    w="100%"
  >
    <CFlex
      v-if="!props.isEnableDonorContactMode"
      align="center"
      justify="space-between"
    >
      <CHeading size="lg">
        {{ state.donor.value?.name }}
      </CHeading>

      <CFlex gap="3">
        <CLink
          v-if="state.recPending.value"
          :as="NuxtLink"
          :href="urls.portfolios.contactDonor(props.planId, props.donorId, state.recPending.value?.id)"
        >
          <CButton>
            Handle rec
          </CButton>
        </CLink>

        <CLink
          :as="NuxtLink as any"
          :href="urls.portfolios.contactDonor(props.planId, props.donorId)"
        >
          <CButton
            :variant="state.recPending.value ? 'outline' : 'solid'"
            :color-scheme="state.recPending.value ? 'gray' : 'blue'"
          >
            Contact
          </CButton>
        </CLink>
        <PDonorCrmLink :donor="state.donor.value" />
      </CFlex>
    </CFlex>

    <CFlex
      justify="space-between"
      h="fit-content"
      align="flex-start"
      :direction="{base: 'column', '2xl': 'row'}"
      :gap="{base: '6', '2xl': '0'}"
    >
      <CTable variant="unstyled" class="p-donor-detail-table" w="fit-content" h="fit-content">
        <CTr v-if="state.nextRecScheduled.value">
          <CTd>Next touch</CTd>
          <CTd>
            <PInput
              :initial="state.nextRecScheduled.value.scheduled_for"
              :api-path="`/portfolios/${props.donorId}/schedule-for`"
              :serializer="(date: string) => ({
                value: date,
              })"
              :label="format.date(state.nextRecScheduled.value.scheduled_for)"
              @model-updated="() => {
                state.nextRecScheduled.value.scheduled_for = $event as string;
                getNextRecScheduled();
              }"
              :success-message="(date: string) => `We won't recommend this donor until ${date}`"
              cta="Schedule"
              :is-auto-tag="!state.nextRecScheduled.value.id"
            />
          </CTd>
        </CTr>

        <CTr>
          <CTd>Next gift</CTd>
          <CTd>
            <PInput
              v-if="state.donor.value"
              :initial="state.donor.value.expected_gift_date"
              :api-path="`/crms/donors/${state.donor.value.pk}/`"
              :serializer="(date: string) => ({
                is_expected_gift_date_user_set: true,
                expected_gift_date: date,
              })"
              :label="format.date(state.donor.value.expected_gift_date)"
              @model-updated="state.donor.value.expected_gift_date = $event as string"
              :success-message="(date) => `Next gift date updated`"
            />
          </CTd>
        </CTr>

        <CTr>
          <CTd>Touches</CTd>
          <CTd>
            <PInput
              v-if="state.donor.value && hooks.loader.plan.value"
              type="number"
              :initial="state.donor.value.touches_before_gift || hooks.loader.plan.value.touches_before_the_gift"
              :api-path="`/crms/donors/${state.donor.value.pk}/`"
              :serializer="value => ({ touches_before_gift: value })"
              :label="state.donor.value.touches_before_gift || hooks.loader.plan.value.touches_before_the_gift"
              @model-updated="state.donor.value.touches_before_gift = $event"
              :success-message="(value) => `Touches plan updated`"
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

              <CLink v-else :href="member.crm_url">
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

    <PDonorGifts v-if="state.donor.value?.gifts" :donor="state.donor.value" />

    <CFlex v-if="state.donor.value?.donor_intels?.length" gap="5" direction="column">
      <CFlex>
        <chakra.img
          src="/donor-search-logo.svg"
          color="white"
          max-w="230px"
          filter="grayscale(1)"
          :_hover="{ filter: 'grayscale(0)'}"
          transition="filter 0.2s"
        />
      </CFlex>
      <PDonorIntel :donor="state.donor.value" />
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
