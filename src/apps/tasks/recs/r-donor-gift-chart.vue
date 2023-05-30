<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { ChartSeries, ChartSeriesItem } from "~/apps/shared/interfaces";
  import { Rec } from "~/apps/tasks/interfaces";
  import { giftsToSeries } from "~/utils";

  const props = defineProps<{
    rec: Rec;
  }>();

  const defaultGiftSeries = [{
    name: "Amount",
    data: [{ x: 5, y: 5 }],
  }];

  const state = {
    giftSeries: ref<ChartSeries>(defaultGiftSeries),
  };

  onBeforeMount(() => {
    loadChartData(props.rec);
  });

  watch(() => props.rec, (recNew?: Rec) => {
    if (!recNew) {
      return;
    }
    loadChartData(recNew);
  });

  function loadChartData(rec: Rec) {
    if (!rec?.donor) {
      return;
    }
    const householdDonors = rec.donor.household?.donors;
    const donorsToChart = householdDonors?.length ? householdDonors : [rec.donor];
    state.giftSeries.value = donorsToChart.map((donor: CrmDonor) => createChartSeries(donor)).filter(val => val);
  }

  function createChartSeries(donor: CrmDonor): ChartSeriesItem {
    if (!donor?.gifts?.length) {
      return;
    }

    return giftsToSeries(donor.name || "Donor", donor.gifts);
  }
</script>

<template>
  <AreaChart :series="state.giftSeries.value" />
</template>
