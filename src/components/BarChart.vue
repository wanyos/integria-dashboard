<template>
  <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
</template>

<script setup>
import { ref, reactive } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  seriesColor: {
    type: String,
    default: '#08B545',
  },
})

const series = ref([
  {
    name: 'Total Inc',
    data: [0, 75, 20, 40, 12, 129, 106],
    color: props.seriesColor,
  },
])

const chartOptions = reactive({
  chart: {
    type: 'bar',
  },
  title: {
    text: `Incidents by day`,
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#1a1a1a',
    },
  },
  subtitle: {
    text: `no data...`,
    align: 'left',
    style: {
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#666',
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '70%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 0,
  },
  grid: {
    padding: {
      top: 10,
      left: 20,
      right: 20,
    },
    // row: {
    //   colors: ['#fff', '#f2f2f2']
    // }
  },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: {
      rotate: -45,
      rotateAlways: true,
      style: {
        fontSize: '12px',
        colors: ['#1a1a1a'],
      },
    },
  },
  yaxis: {
    min: 0,
    max: 200,
    tickAmount: 5,
    labels: {
      formatter: function (value) {
        return value.toFixed(0) // Mostrar valores enteros
      },
      style: {
        fontSize: '12px',
        colors: ['#1a1a1a'],
      },
      offsetX: 10,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.25,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 0.85,
      opacityTo: 0.85,
      stops: [50, 0, 100],
    },
  },
})
</script>

<style lang="css" scoped></style>
