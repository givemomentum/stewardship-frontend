<script lang="ts" setup>
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
    expectedGiftDate: ref(new Date()),
    isGiftDateEditMode: ref(false),
    isGiftDateSaving: ref(false),
  };

  async function getDetails() {
    const res = await hooks.api.get(`/crms/donors/${props.donor.objectID}/`);
    state.donorDetails.value = res.data;
  }

  async function getActions() {
    const res = await hooks.api.get(`/crms/actions/?donor=${props.donor.objectID}`);
    state.donorActions.value = res.data;
  }

  async function getGifts() {
    const res = await hooks.api.get(`/crms/gifts/?donor=${props.donor.objectID}`);
    state.gifts.value = res.data;
  }

  onMounted(async () => {
    getDetails();
    getActions();
    getGifts();
  });

  async function updateGiftDate() {
    state.isGiftDateSaving.value = true;
    const res = await hooks.api.patch(`/crms/donors/${props.donor.objectID}/`, {
      expected_gift_date: state.expectedGiftDate.value,
      is_expected_gift_date_user_set: true,
    });
    state.isGiftDateSaving.value = false;
    hooks.notify.send("Next gift date updated");
    state.donorDetails.value = res.data;
    state.isGiftDateEditMode.value = false;
  }
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
      <CTr v-if="state.donorDetails.value?.last_gift_amount">
        <CTd fontWeight="bold">
          Next gift
        </CTd>

        <CTd>
          <CFlex align="center" gap="4">
            <span v-if="!state.isGiftDateEditMode.value">{{ format.date(state.donorDetails.value?.expected_gift_date) }}</span>
            <CInput
              v-else
              type="date"
              size="xs"
              w="fit-content"
              v-model="state.expectedGiftDate.value"
            />
            <CButton
              v-if="!state.isGiftDateEditMode.value"
              @click="state.isGiftDateEditMode.value = !state.isGiftDateEditMode.value"
              size="xs"
              left-icon="edit"
              variant="outline"
            >
              Edit
            </CButton>
            <CButton
              v-else
              @click="updateGiftDate()"
              size="xs"
              variant="solid"
              :is-loading="state.isGiftDateSaving.value"
            >
              Save
            </CButton>
          </CFlex>
        </CTd>
      </CTr>

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
