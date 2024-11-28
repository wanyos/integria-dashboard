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
import { ref, reactive, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { generateDataStakedBar } from '../utils/dataProcessor'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useChartUtils } from '@/composables/useChartUtils'

const props = defineProps({
  allIncidentsGroup: {
    type: Object,
    default: () => ({}),
  },
})

const groups = [
  'Operadores',
  'Técnicos',
  'Administradores',
  'Ciberseguridad',
  'Apl.Horizontales',
  'Apl.Negocio',
  'Tec.Externo',
]

const { chartRef, handleMouseLeave } = useChartUtils()
const isLoading = ref(false)
// const chartRef = ref(null)
const seriesData = ref([])

// const seriesDataMock = ref([
//   {
//     name: 'Abiertas',
//     data: [10, 20, 30, 40, 50, 60, 70],
//   },
//   {
//     name: 'Cerradas',
//     data: [5, 15, 25, 35, 45, 55, 65],
//   },
// ])

// Watch for changes in allIncidentsGroup and update seriesData
watch(
  () => props.allIncidentsGroup,
  (newIncidents) => {
    isLoading.value = true
    const groupsData = generateDataStakedBar(newIncidents)
    seriesData.value = groupsData.incidents
    isLoading.value = false
  },
  { immediate: true },
)

const chartOptions = reactive({
  chart: {
    type: 'bar',
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '90%',
      borderRadius: 6,
      minBarLength: 20,
      dataLabels: {
        position: 'center', // Coloca los labels al centro
        offsetX: 5, // Da un pequeño margen a los labels
        total: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: '14px',
            fontWeight: 500,
          },
        },
      },
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff'],
  },
  title: {
    text: 'Incidents by group and status',
  },
  xaxis: {
    type: 'logarithmic',
    categories: groups,
    labels: {
      show: false, // Oculta los labels del eje x
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0, // Establece un valor mínimo para el eje y
    forceNiceScale: true, // Fuerza una escala agradable
    title: {
      text: undefined,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  tooltip: {
    enabled: false,
    y: {
      formatter: function (val) {
        return val + 'K'
      },
    },
  },
  grid: {
    show: false,
    padding: {
      top: -10,
      right: 0,
      bottom: 0,
      left: 10,
    },
  },
  fill: {
    colors: ['#6cbc6c', '#ee7e7e'],
    opacity: 1,
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    offsetX: 40,
    markers: {
      colors: ['#6cbc6c', '#ee7e7e'],
    },
  },
})
</script>

<style lang="css" scoped></style>
