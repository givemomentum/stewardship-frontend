<script lang="ts" setup>
  import { format } from "~/utils";

  const props = defineProps<{
    series: Series[];
  }>();

  interface Series {
    name: string,
    data: ({ x: number, y: number })[]
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
    colors: ["#4299e1", "#48bb78", "#f6ad55", "#ed64a6"], // colors chosen by ChatGPT
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
      :series="$props.series"
    />
  </div>
</template>
