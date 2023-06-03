<script lang="ts" setup>
  import { parseISO } from "date-fns";
  import { ChartDataItem } from "~/apps/shared/interfaces";
  import { CrmDonor } from "~/apps/letters/interfaces";

  const props = defineProps<{
    donor: CrmDonor;
  }>();

  const state = {
    giftSeries: ref<ChartDataItem[] | null>(null),
    giftSeriesAll: ref<ChartDataItem[] | null>(null),
    donorColorMap: ref<{ [key: string]: string }>({}),
  };

  onMounted(async () => {
    let giftSeries: ChartDataItem[] = [];
    const isHousehold = props.donor.household.donors.length > 1;
    for (const donor of props.donor.household.donors) {
      giftSeries = giftSeries.concat(
        donor.gifts.map(gift => ({
          x: parseISO(gift.date).getTime(),
          y: Number(gift.amount),
          fillColor: isHousehold ? getDonorColor(donor.name) : "#4299e1",
          label: donor.name,
        })),
      );
      giftSeries = giftSeries.sort((a, b) => a.x - b.x);
    }
    state.giftSeries.value = giftSeries.slice(-25);
    state.giftSeriesAll.value = giftSeries;
  });

  function getDonorColor(donorName: string): string {
    // gpt code
    const colors = ["#ed64a6", "#48bb78", "#f6ad55", "#ed64a6"];

    if (donorName === props.donor.name) {
      state.donorColorMap.value[donorName] = "#4299e1";
      return "#4299e1";
    }

    if (state.donorColorMap.value[donorName]) {
      return state.donorColorMap.value[donorName];
    }

    let hash = 0;
    for (let i = 0; i < donorName.length; i++) {
      hash = donorName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash into a positive index value and use it to get a color
    const index = Math.abs(hash) % colors.length;
    const color = colors[index];

    state.donorColorMap.value[donorName] = color;

    return color;
  }
</script>

<template>
  <CFlex gap="3" direction="column">
    <CHeading font-size="2xl" color="gray.500">
      Giving History
    </CHeading>

    <CText
      v-if="state.giftSeriesAll.value?.length > state.giftSeries.value?.length"
      color="gray.500"
      font-size="sm"
    >
      Showing last 25 gifts
    </CText>

    <AreaChart
      v-if="state.giftSeries.value"
      :series="[{ data: state.giftSeries.value, name: '' }]"
    />
  </CFlex>
</template>
