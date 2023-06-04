<script lang="ts" setup>
  import { format } from "~/utils";
  import { ChartSeries } from "~/apps/shared/interfaces";

  const props = defineProps<{
    series: ChartSeries;
  }>();

  onMounted(() => {
    // appears sometimes, the issue isn't resolved as of June 2023
    // github.com/apexcharts/vue3-apexcharts/issues/3
    nextTick(() => {
      window.dispatchEvent(new Event('resize'));
    });
  });

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
      size: 6,
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
        title: {
          formatter: (seriesName, opts) => {
            const pointIndex = opts.dataPointIndex;
            const pointData = props.series[opts.seriesIndex].data[pointIndex];
            if (pointData && pointData.label) {
              return `<span style="color: ${pointData.fillColor}">${pointData.label}</span>`;
            }
            return seriesName;
          }
        }
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
      height="190"
      type="area"
      :options="chartOptions"
      :series="props.series"
    />
  </div>
</template>

<style>
.apexcharts-tooltip-marker {
  display: none !important;
}
</style>
