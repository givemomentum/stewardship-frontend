<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { CrmDonor } from "~/apps/letters/interfaces";
  import { Rec } from "~/apps/tasks/interfaces";
  import { format } from "~/utils";
  import { parseISO } from "date-fns";

  const props = defineProps<{
    rec: Rec;
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
    loadChartData(props.rec);
  });

  watch(() => props.rec, (recNew?: Rec) => {
    if (!recNew) {
      return;
    }
    loadChartData(recNew);
  });

  function createChartSeries(donor: CrmDonor): GiftSeries {
    if (!donor?.gifts?.length) {
      return;
    }
    return {
      name: donor.name || "Donor",
      data: donor.gifts
        // TODO: It would be better to filter gifts on the backend, but this is technically much easier to do.
        .filter(gift => Number(gift.amount) && ["one_time", "recurring_payment"].includes(gift.gift_type))
        .map(gift => (
          {
            x: parseISO(gift.date).getTime(),
            y: Number(gift.amount),
          }
        )),
    };
  }

  function loadChartData(rec: Rec) {
    if (!rec?.donor) {
      return;
    }
    const householdDonors = rec.donor.household?.donors;
    const donorsToChart = householdDonors?.length ? householdDonors : [rec.donor];
    state.giftSerieses.value = donorsToChart.map((donor: CrmDonor) => createChartSeries(donor)).filter(val => val);
  }

  const chartOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: 280,
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 3,
    },
    colors: ["#4299e1"],
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
      width="100%"
      height="250"
      type="area"
      :options="chartOptions"
      :series="state.giftSerieses.value"
    />
  </div>
</template>
