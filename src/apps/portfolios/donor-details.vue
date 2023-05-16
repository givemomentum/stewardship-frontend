<script lang="ts" setup>
  import { format } from "~/utils";

//   {
//     "pk": 1066451,
//     "source_id": "0038c00003GIRhfAAH",
//     "source": "salesforce",
//     "salutation": "",
//     "name": "Emma Johnson",
//     "first_name": "Emma",
//     "last_name": "Johnson",
//     "spouse_name": "",
//     "mailing_address": {
//         "pk": 1156308,
//         "address_line1": "123 Main St",
//         "address_line2": "",
//         "city": "New York",
//         "state": "NY",
//         "zip": "10006",
//         "country": "United States",
//         "one_line": "123 Main St, New York, NY 10006"
//     },
//     "email": "victor+emma@givemomentum.com",
//     "phone_number": "",
//     "birthday": "1980-01-15",
//     "crm_url": "https://momentum57-dev-ed.my.salesforce.com/lightning/r/Contact/0038c00003GIRhfAAH/view",
//     "donated_total": 550000,
//     "donation_biggest": 300000,
//     "do_not_email": false,
//     "do_not_call": false,
//     "do_not_mail": false,
//     "do_not_contact": false,
//     "giving_since": "2019-12-18T00:00:00",
//     "letter_label": "Emma Johnson\n123 Main St \nNew York, NY, 10006",
//     "last_contact": "2023-04-30T23:11:56Z",
//     "donation_average": 275000,
//     "last_gift_date": "2021-12-22T00:00:00",
//     "last_gift_amount": 300000,
//     "last_recurring_gift_date": null,
//     "custom_data": {},
//     "communication_preferences": ""
// }

  const props = defineProps<{
    donor: any;
  }>();

  const hooks = {
    api: useApi(),
  };

  const donorDetails = ref(null)

  async function fetchDetails() {
    const res = await hooks.api.get(`/crms/donors/${props.donor.objectID}`);
    donorDetails.value = res.data;
  }

  onMounted(async () => {
    console.log("MOUNTED");

    fetchDetails();

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
    </CBox>
</template>