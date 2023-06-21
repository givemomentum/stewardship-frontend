<script lang="ts" setup>
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { format } from "~/utils";

  const props = defineProps<{
    donor: CrmDonor;
  }>();
</script>

<template>
  <CTable
    variant="unstyled"
    class="p-donor-detail-table"
    w="fit-content"
    h="fit-content"
  >
    <CTr v-if="props.donor.donor_insights.capacity_range">
      <CTd>
        Estimated capacity
      </CTd>

      <CTd>
        {{ props.donor.donor_insights.capacity_range }}
      </CTd>
    </CTr>

    <CTr v-if="props.donor.donor_insights.gifts_total">
      <CTd>
        Historical gifts
      </CTd>

      <CTd>
        {{ format.money(props.donor.donor_insights.gifts_total) }}, over {{ props.donor.donor_insights.gifts_count }} gifts
      </CTd>
    </CTr>

    <CTr v-if="props.donor.donor_insights.largest_gift_org">
      <CTd>
        Largest gift
      </CTd>

      <CTd>
        {{ format.money(props.donor.donor_insights.largest_gift_max) }} to {{ props.donor.donor_insights.largest_gift_org }}
      </CTd>
    </CTr>

    <CTr v-if="props.donor.donor_insights.real_estate_estimate">
      <CTd>
        Real estate holdings
      </CTd>

      <CTd>
        {{ format.money(props.donor.donor_insights.real_estate_estimate) }} across properties
      </CTd>
    </CTr>

    <CTr v-if="props.donor.donor_insights.sec_stock_value">
      <CTd>
        SEC holdings
      </CTd>

      <CTd>
        {{ format.money(props.donor.donor_insights.sec_stock_value) }}
      </CTd>
    </CTr>
  </CTable>
</template>
