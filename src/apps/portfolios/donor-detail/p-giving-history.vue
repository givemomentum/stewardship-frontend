<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { CrmGift } from "~/apps/letters/interfaces";
  import { ChartSeries } from "~/apps/shared/interfaces";
  import { giftsToSeries } from "~/utils";

  const props = defineProps<{
    donorName?: string;
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
    transformSeries(props.donorName, props.gifts);
  });

  watch(() => props.gifts, (newGifts?: CrmGift[]) => {
    transformSeries(props.donorName, newGifts || []);
  });

  function transformSeries(donorName: string, gifts: CrmGift[]) {
    state.giftSeries.value = [giftsToSeries(donorName, gifts)];
  }
</script>

<template>
  <AreaChart :series="state.giftSeries.value" />
</template>
