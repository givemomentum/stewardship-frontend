<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { CrmGift } from "~/apps/letters/interfaces";
  import { parseISO } from "date-fns";

  const props = defineProps<{
    gifts: CrmGift[];
  }>();

  interface GiftSeries {
    name: string,
    data: ({ x: number, y: number })[]
  }

  const defaultGiftSerieses = [{
    name: "Amount",
    data: [{ x: 5, y: 5 }],
  }];

  const state = {
    giftSerieses: ref<GiftSeries[]>(defaultGiftSerieses),
  };

  onBeforeMount(() => {
    transformSeries(props.gifts);
  });

  watch(() => props.gifts, (newGifts?: CrmGift[]) => {
    transformSeries(newGifts || []);
  });

  function transformSeries(gifts: CrmGift[]) {
    state.giftSerieses.value = [{
      name: "Donor",
      data: gifts
        // TODO: It would be better to filter gifts on the backend, but this is technically much easier to do.
        .filter(gift => Number(gift.amount) && ["one_time", "recurring_payment"].includes(gift.gift_type))
        .map(gift => (
          {
            x: parseISO(gift.date).getTime(),
            y: Number(gift.amount),
          }
        )),
    }];
  }
</script>

<template>
  <CText fontSize="1.2rem">
    Giving History
  </CText>

  <AreaChart :series="state.giftSerieses.value" />
</template>
