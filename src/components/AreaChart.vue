<template>
  <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :color="'#1565C0'" />
  <VueApexCharts
    ref="chartRef"
    width="100%"
    height="100%"
    :options="chartOptions"
    :series="seriesArea"
    @mouse-leave="handleMouseLeave"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useChartUtils } from '@/composables/useChartUtils'
import { generateAreapData } from '../utils/dataProcessor'

const props = defineProps({
  year: {
    type: [String, Number],
    default: '',
  },
  incidents: {
    type: Array,
    default: () => [],
  },
})

const { chartRef, handleMouseLeave } = useChartUtils()
const seriesArea = ref([])
const isLoading = ref(false)
const currentYear = ref(null)

// const seriesData = [
//   {
//     name: 'Incidents',
//     data: [
//       { x: 'January', y: 30 },
//       { x: 'February', y: 40 },
//       { x: 'March', y: 35 },
//       { x: 'April', y: 50 },
//       { x: 'May', y: 55 },
//       { x: 'June', y: 60 },
//       { x: 'July', y: 70 },
//       { x: 'August', y: 65 },
//       { x: 'September', y: 75 },
//       { x: 'October', y: 80 },
//       { x: 'November', y: 85 },
//       { x: 'December', y: 90 },
//     ],
//   },
// ]

watch(
  [() => props.incidents, () => props.year],
  ([newIncidents, newYear]) => {
    isLoading.value = true
    currentYear.value = newYear
    seriesArea.value = generateAreapData(newIncidents)
    if (chartRef.value) {
      chartRef.value.updateOptions({
        title: {
          text: `Incidents month of the year ${newYear}`,
        },
      })
    }
    isLoading.value = false
  },
  { immediate: true },
)

const chartOptions = ref({
  chart: {
    id: 'area-datetime',
    type: 'area',
    zoom: {
      autoScaleYaxis: true,
    },
  },
  title: {
    text: `Incidents month of the year ${currentYear.value}`,
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#1a1a1a',
    },
  },
  stroke: {
    curve: 'smooth',
    width: 1,
    colors: ['#0096FB'],
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
    style: 'hollow',
  },
  xaxis: {
    type: 'category',
    categories: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: '#0096FB',
          opacity: 0.5,
        },
      ],
    },
  },
})
</script>

<style scoped></style>
