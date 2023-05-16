<script lang="ts" setup>
  import { format } from "~/utils";
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
    <CText fontSize="1.2rem">
      {{ $props.donor.name }}
    </CText>

    <CText my="1rem">
      ??? potential gift
    </CText>

    <div>
      Last time gift: {{ format.money(donorDetails?.last_gift_amount) }}
    </div>

    <div>
      Lifetime giving: {{ format.money($props.donor.donated_total) }}
    </div>

    <div>
      Giving since: {{ format.dateFromUnixV2($props.donor.giving_since) }}
    </div>

    <div>
      Recurring giving: ?
    </div>

    <div>
      CRM Profile: {{ $props.donor.crm_url }}
    </div>

    <div>
      Email: {{ $props.donor.email }}
    </div>

    <div>
      Phone: {{ $props.donor.phone_number || "N/A" }}
    </div>

    <div>
      Address: {{ $props.donor.address }}
    </div>

    <GivingHistory v-if="gifts?.length" :donorName="$props.donor.name" :gifts="gifts" />

    <RecsRLastActions v-if="donorActions?.length" :actions="donorActions" />
  </CBox>
</template>
