<script lang="ts" setup>
  import { format, getShortRecurringGiftDescription } from "~/utils";
  import { CrmAction, CrmGift, CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    donor: any; // TODO: add Algolia Donor type
  }>();

  const hooks = {
    api: useApi(),
  };

  const state = {
    donorDetails: ref<CrmDonor>(null),
    donorActions: ref<CrmAction[]>([]),
    gifts: ref<CrmGift[]>([]),
  };

  async function getDetails() {
    // TODO: catch errors
    const res = await hooks.api.get(`/crms/donors/${props.donor.objectID}`);
    state.donorDetails.value = res.data;
  }

  async function getActions() {
    // TODO: catch errors
    const res = await hooks.api.get(`/crms/actions/?donor=${props.donor.objectID}`);
    state.donorActions.value = res.data;
  }

  async function getGifts() {
    // TODO: catch errors
    const res = await hooks.api.get(`/crms/gifts/?donor=${props.donor.objectID}`);
    state.gifts.value = res.data;
  }

  onMounted(async () => {
    getDetails();
    getActions();
    getGifts();
  });

</script>

<template>
  <CBox p="6">
    <CHeading font-size="2xl" font-weight="normal">
      {{ props.donor.name }}
    </CHeading>

    <CTable variant="unstyled" size="sm">
      <CTr v-if="state.donorDetails.value?.last_gift_amount">
        <CTd p="0" fontWeight="bold">
          Last gift
        </CTd>

        <CTd>
          {{ format.money(state.donorDetails.value?.last_gift_amount) }} on
          {{ format.date(state.donorDetails.value?.last_gift_date) }}
        </CTd>
      </CTr>

      <CTr v-if="props.donor?.donated_total">
        <CTd p="0" fontWeight="bold">
          Lifetime giving
        </CTd>

        <CTd>
          {{ format.money(props.donor.donated_total) }}
        </CTd>
      </CTr>

      <CTr v-if="props.donor?.giving_since">
        <CTd p="0" fontWeight="bold">
          Giving since
        </CTd>

        <CTd>
          {{ format.dateFromUnixV2(props.donor.giving_since) }}
        </CTd>
      </CTr>

      <CTr>
        <CTd p="0" fontWeight="bold">
          Recurring giving
        </CTd>

        <CTd>
          {{ getShortRecurringGiftDescription(props.donor) }}
        </CTd>
      </CTr>

      <CTr v-if="props.donor?.crm_url">
        <CTd p="0" fontWeight="bold">
          CRM Profile
        </CTd>

        <CTd>
          <CLink
            :href="props.donor?.crm_url"
            h="0"
            is-external
            @click.stop=""
          >
            <CButton right-icon="external-link" variant="link">
              <!-- Workaround for Donor Perfect link issue: Show Donor Id, so she can copy it.-->
              {{
                props.donor?.source == "donor_perfect" ? props.donor?.source_id : "CRM"
              }}
            </CButton>
          </CLink>
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

    <GivingHistory :donorName="props.donor.name" :gifts="state.gifts.value" />

    <RecsRLastActions v-if="state.donorActions.value?.length" :actions="state.donorActions.value" />
  </CBox>
</template>
