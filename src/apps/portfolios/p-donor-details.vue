<script lang="ts" setup>
  import PDonorGiftDateInput from "~/apps/portfolios/p-donor-gift-date-input.vue";
  import { format } from "~/utils";
  import { CrmAction, CrmGift, CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    donor: any; // TODO: add Algolia Donor type
  }>();

  const hooks = {
    api: useApi(),
    notify: useNotify(),
  };

  const state = {
    donorDetails: ref<CrmDonor>(null),
    donorActions: ref<CrmAction[]>([]),
    gifts: ref<CrmGift[]>([]),
  };

  onMounted(async () => {
    hooks.api.get(`/crms/donors/${props.donor.objectID}/`).then((res) => {
      state.donorDetails.value = res.data;
    });
    hooks.api.get(`/crms/actions/?donor=${props.donor.objectID}`).then((res) => {
      state.donorActions.value = res.data;
    });
    hooks.api.get(`/crms/gifts/?donor=${props.donor.objectID}`).then((res) => {
      state.gifts.value = res.data;
    });
  });
</script>

<template>
  <CFlex
    p="6"
    pr="10"
    direction="column"
    gap="5"
  >
    <CFlex align="center" justify="space-between" key="2">
      <CHeading size="lg">
        {{ props.donor.name }}
      </CHeading>
      <CLink
        :href="props.donor?.crm_url"
        is-external
      >
        <CButton
          right-icon="external-link"
          variant="outline"
          color-scheme="gray"
        >
          <!-- Workaround for Donor Perfect link issue: Show Donor Id, so she can copy it.-->
          {{
            props.donor?.source == "donor_perfect" ? props.donor?.source_id : "CRM Profile"
          }}
        </CButton>
      </CLink>
    </CFlex>

    <CTable variant="unstyled" class="p-donor-detail-table" w="fit-content">
      <PDonorGiftDateInput
        :donor="state.donorDetails.value"
        @donorUpdated="state.donorDetails.value = $event"
      />

      <CTr v-if="state.donorDetails.value?.last_gift_amount">
        <CTd fontWeight="bold">
          Last gift
        </CTd>

        <CTd>
          {{ format.money(state.donorDetails.value?.last_gift_amount) }} on
          {{ format.date(state.donorDetails.value?.last_gift_date) }}
        </CTd>
      </CTr>

      <CTr v-if="props.donor?.donated_total">
        <CTd fontWeight="bold">
          Lifetime giving
        </CTd>

        <CTd>
          {{ format.money(props.donor.donated_total) }}
        </CTd>
      </CTr>

      <CTr v-if="props.donor?.giving_since">
        <CTd fontWeight="bold">
          Giving since
        </CTd>

        <CTd>
          {{ format.dateFromUnixV2(props.donor.giving_since) }}
        </CTd>
      </CTr>
    </CTable>

    <CBox>
      <CFlex direction="column">
        <CFlex
          v-if="props.donor.email"
          :py="{ base: 1, '2xl': 2 }"
          align="center"
          gap="2"
          white-space="nowrap"
        >
          <CIcon size="5" color="gray.500" name="email" />
          {{ props.donor.email }}
        </CFlex>

        <CFlex
          v-if="props.donor.phone_number"
          :py="{ base: 1, '2xl': 2 }"
          align="center"
          gap="2"
          white-space="nowrap"
        >
          <CIcon size="5" fill="gray.500" name="io-call" />
          {{ props.donor.phone_number }}
        </CFlex>

        <CFlex
          v-if="state.donorDetails.value?.mailing_address?.city"
          :py="{ base: 1, '2xl': 2 }"
          align="center"
          gap="2"
          white-space="nowrap"
        >
          <CIcon size="5" fill="gray.500" name="fa-map-marker-alt" />
          {{ state.donorDetails.value?.mailing_address.city }}, {{ state.donorDetails.value?.mailing_address.state }}
        </CFlex>
      </CFlex>
    </CBox>

    <PGivingHistory :donorName="props.donor.name" :gifts="state.gifts.value" />

    <RecsRLastActions v-if="state.donorActions.value?.length" :actions="state.donorActions.value" />
  </CFlex>
</template>

<style lang="scss">
  .p-donor-detail-table {
    td {
      padding: 0.5rem;
      padding-right: 2rem;

      &:first-child {
        padding-left: 0;
      }
    }
  }
</style>
