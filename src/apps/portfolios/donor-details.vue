<script lang="ts" setup>
  import { format } from "~/utils";

  const props = defineProps<{
    donor: any;
  }>();

  const hooks = {
    api: useApi(),
  };

  const donorDetails = ref(null);
  const donorActions = ref([]);
  const gifts = ref([]);

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
    const res = await hooks.api.get(`/crms/gifts/?donor=${props.donor.objectID}`);
    gifts.value = res.data;
  }

  onMounted(async () => {
    console.log("MOUNTED");

    getDetails();
    getActions();
    getGifts();

    // const res1 = await hooks.api.get(`/crms/donors/${props.donor.objectID}`);
    // const res2 = await hooks.api.get(`crms/actions/?donor=${props.donor.objectID}`);
    // console.log(res2.data);

    // state.searchIndexName.value = res.data.index_name;
    // state.searchClient.value = algoliasearch(
    //   res.data.app_id,
    //   res.data.api_key,
    // );
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

    <GivingHistory :gifts="gifts" />
    </CBox>
</template>