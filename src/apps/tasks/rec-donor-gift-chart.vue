<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { Recommendation } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";
  import { parseISO } from "date-fns";

  const props = defineProps<{
    rec: Recommendation;
  }>();

  const state = {
    giftSeries: ref<{ x: number, y: number }[]>([{ x: 5, y: 5 }]),
  };

  onBeforeMount(() => {
    loadChartData(props.rec);
  });

  watch(() => props.rec, (recNew?: Recommendation) => {
    if (!recNew) {
      return;
    }
    loadChartData(recNew);
  });

  function loadChartData(rec: Recommendation) {
    if (rec?.donor?.gifts?.length) {
      state.giftSeries.value = rec.donor.gifts
        .filter(gift => Number(gift.amount))
        .map(gift => (
          {
            x: parseISO(gift.date).getTime(),
            y: Number(gift.amount),
          }
        ));
    }
  }

  const chartOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: 280,
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: amount => format.money(amount),
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: amount => format.money(amount),
      },
      x: {
        formatter: (date: number) => format.dateFromUnix(date),
      },
    },
  };
</script>

<template>
  <div>
    <apexchart
      width="780"
      height="250"
      type="area"
      :options="chartOptions"
      :series="[{
        name: 'Amount',
        data: state.giftSeries.value,
      }]"
    />
  </div>
</template>
