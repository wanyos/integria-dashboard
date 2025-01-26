<template>
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
import { nextTick, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

import { useChartUtils } from '@/composables/useChartUtils'
// import { generateAreapData } from '../utils/dataProcessor'

const props = defineProps({
  id: {
    type: String,
    default: 'areachart',
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: [String, Number],
    default: '',
  },
  color: {
    type: String,
  },
  incidents: {
    type: Array,
    default: () => [],
  },
})

const { chartRef, handleMouseLeave } = useChartUtils()
const seriesArea = ref([])

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

const chartOptions = ref({
  chart: {
    id: `${props.id}`,
    // group: 'histogram',
    type: 'area',
    zoom: {
      enabled: false,
      autoScaleYaxis: true,
    },
  },
  title: {
    text: `${props.title}`,
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#1a1a1a',
    },
  },
  subtitle: {
    text: `Year: ${props.subtitle}`,
    align: 'center',
    style: {
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#1a1a1a',
    },
  },
  stroke: {
    curve: 'smooth',
    width: 1,
    colors: [`${props.color}`],
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    style: 'hollow',
    size: 4, // Tamaño del punto
    colors: [`${props.color}`], // Color del punto
    strokeColors: '#fff', // Color del borde del punto
    strokeWidth: 2, // Ancho del borde
    hover: {
      size: 6, // Tamaño del punto al pasar el cursor
    },
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
    // shared: true,
    // intersect: false,
    marker: {
      show: true, // Muestra el marcador en el tooltip
      fillColors: [`${props.color}`], // Color del marcador en el tooltip
    },
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
          color: `${props.color}`,
          opacity: 0.5,
        },
      ],
    },
  },
})

watch(
  () => props.incidents,
  async (newIncidents) => {
    // seriesArea.value = generateAreapData(newIncidents)
    seriesArea.value = newIncidents
    await nextTick()
    chartOptions.value = {
      ...chartOptions.value,
      title: {
        text: `${props.title}`,
      },
      subtitle: {
        text: `Year: ${props.subtitle}`,
      },
      stroke: {
        colors: [`${props.color}`],
      },
      markers: {
        colors: [`${props.color}`],
      },
      tooltip: {
        marker: {
          fillColors: [`${props.color}`],
        },
      },
      fill: {
        gradient: {
          colorStops: [
            {
              color: `${props.color}`,
            },
          ],
        },
      },
    }
  },
  { immediate: true },
)
</script>

<style scoped></style>
