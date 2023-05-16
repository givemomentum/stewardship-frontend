<script lang="ts" setup>
  import { format, getShortRecurringGiftDescription } from "~/utils";
  import { CrmAction, CrmGift, CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    donor: any; // TODO: add Algolia Donor type
  }>();

  const hooks = {
    api: useApi(),
  };

  // TODO: wrap these in a single object ?
  const donorDetails = ref<CrmDonor>(null);
  const donorActions = ref<CrmAction[]>([]);
  const gifts = ref<CrmGift[]>([]);

  async function getDetails() {
    // TODO: catch errors
    const res = await hooks.api.get(`/crms/donors/${props.donor.objectID}`);
    donorDetails.value = res.data;
  }

  async function getActions() {
    // TODO: catch errors
    const res = await hooks.api.get(`/crms/actions/?donor=${props.donor.objectID}`);
    donorActions.value = res.data;
  }

  async function getGifts() {
    // TODO: catch errors
    const res = await hooks.api.get(`/crms/gifts/?donor=${props.donor.objectID}`);
    gifts.value = res.data;
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

    <CText my="1rem">
      ??? potential gift
    </CText>

    <CTable variant="unstyled" size="sm">
      <CTr>
        <CTd p="0" fontWeight="bold">
          Last gift
        </CTd>

        <CTd>
          {{ format.money(donorDetails?.last_gift_amount) }} on
          {{ format.date(donorDetails?.last_gift_date) }}
        </CTd>
      </CTr>

      <CTr>
        <CTd p="0" fontWeight="bold">
          Lifetime giving
        </CTd>

        <CTd>
          {{ format.money(props.donor.donated_total) }}
        </CTd>
      </CTr>

      <CTr>
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

      <CTr>
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
                props.donor?.source == "donor_perfect" ? props.donor?.source_id : "View"
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
          v-if="donorDetails?.mailing_address?.city"
          :py="{ base: 1, '2xl': 2 }"
          align="center"
          gap="2"
          white-space="nowrap"
        >
          <CIcon size="5" fill="gray.500" name="fa-map-marker-alt" />
          {{ donorDetails?.mailing_address.city }}, {{ donorDetails?.mailing_address.state }}
        </CFlex>
      </CFlex>
    </CBox>

    <GivingHistory v-if="gifts?.length" :donorName="props.donor.name" :gifts="gifts" />

    <RecsRLastActions v-if="donorActions?.length" :actions="donorActions" />
  </CBox>
</template>
