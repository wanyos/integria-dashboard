<template>
  <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :color="'#1565C0'" />
  <VueApexCharts
    ref="chartRef"
    width="100%"
    height="100%"
    :options="chartOptions"
    :series="seriesData"
    @mouse-leave="handleMouseLeave"
  />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useChartUtils } from '@/composables/useChartUtils'

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
const series = ref([])
const isLoading = ref(false)
const currentYear = ref(null)

const seriesData = [
  {
    name: 'Incidencias',
    data: [
      { x: 'Enero', y: 30 },
      { x: 'Febrero', y: 40 },
      { x: 'Marzo', y: 35 },
      { x: 'Abril', y: 50 },
      { x: 'Mayo', y: 55 },
      { x: 'Junio', y: 60 },
      { x: 'Julio', y: 70 },
      { x: 'Agosto', y: 65 },
      { x: 'Septiembre', y: 75 },
      { x: 'Octubre', y: 80 },
      { x: 'Noviembre', y: 85 },
      { x: 'Diciembre', y: 90 },
    ],
  },
]

watch(
  () => props.incidents,
  (newIncidents) => {
    isLoading.value = true
    currentYear.value = props.year
    // seriesHeat.value = generateHeatmapData(newIncidents)
    isLoading.value = false
  },
  { immediate: true },
)

// onMounted(() => {
//   series.value = generateRandomTimeSeries()
// })

// function generateRandomTimeSeries() {
//   const startDate = new Date('2023-01-01T00:00:00Z')
//   const endDate = new Date('2024-10-31T23:59:59Z')
//   const dailyData = []

//   for (
//     let currentDate = new Date(startDate);
//     currentDate <= endDate;
//     currentDate.setDate(currentDate.getDate() + 1)
//   ) {
//     const timestamp = currentDate.getTime()
//     const randomValue = Math.floor(Math.random() * 21)
//     dailyData.push([timestamp, randomValue])
//   }
//   return dailyData
// }

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
  //     xaxis: [
  //       {
  //         x: new Date('14 Nov 2012').getTime(),
  //         borderColor: '#999',
  //         yAxisIndex: 0,
  //         label: {
  //           show: true,
  //           text: 'Rally',
  //           style: {
  //             color: '#fff',
  //             background: '#775DD0'
  //           }
  //         }
  //       }
  //     ]
  //   },
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
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
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
        // {
        //   offset: 100,
        //   color: '#08B510',
        //   opacity: 0.9
        // }
      ],
    },
  },
})
</script>

<style scoped></style>
