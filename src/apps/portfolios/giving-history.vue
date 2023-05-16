<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { CrmGift } from "~/apps/letters/interfaces";
  import { ChartSeries } from "~/apps/shared/interfaces";
  import { transformGiftsToChartData } from "~/utils";

  const props = defineProps<{
    gifts: CrmGift[];
  }>();

  const defaultGiftSeries = [{
    name: "Amount",
    data: [{ x: 5, y: 5 }],
  }];

  const state = {
    giftSeries: ref<ChartSeries>(defaultGiftSeries),
  };

  onBeforeMount(() => {
    transformSeries(props.gifts);
  });

  watch(() => props.gifts, (newGifts?: CrmGift[]) => {
    transformSeries(newGifts || []);
  });

  function transformSeries(gifts: CrmGift[]) {
    state.giftSeries.value = [{
      name: "Donor",
      data: transformGiftsToChartData(gifts),
    }];
  }
</script>

<template>
  <CText fontSize="1.2rem">
    Giving History
  </CText>

  <AreaChart :series="state.giftSeries.value" />
</template>
