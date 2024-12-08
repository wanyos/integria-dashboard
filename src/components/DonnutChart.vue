<template>
  <VueApexCharts
    ref="chartRef"
    width="100%"
    height="100%"
    :options="chartOptions"
    :series="series"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useChartUtils } from '@/composables/useChartUtils'
import { generateDataDonnut } from '../utils/dataProcessor'

const props = defineProps({
  incidents: {
    type: Object,
    default: () => {},
  },
  subtitle: {
    type: String,
    default: '',
  },
})

// const series = ref([14, 32, 12, 9, 5, 23])
const { chartRef } = useChartUtils()
const series = ref([])

const chartOptions = ref({
  chart: {
    type: 'donut',
  },
  labels: [],
  colors: ['#0096FB', '#8DBCFD', '#CCEAFE', '#A3E4D7', '#F9E79F', '#F5CBA7', '#D7BDE2', '#AED6F1'],
  grid: {
    padding: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: '50%',
      },
    },
  },
  title: {
    text: `Incidents by place`,
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
  //   fill: {
  //     colors: ['#08B545', '#CEF0DA'], // Colores predeterminados
  //     hover: {
  //       opacity: 1 // Desactivar cualquier cambio de opacidad en hover
  //     }
  //   },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      colors: ['#1a1a1a'],
    },
  },
  legend: {
    show: true,
  },
})

const defaultLabels = [
  'Pacifico',
  'Carabacnhel',
  'Entrevias',
  'Sanchinarro',
  'La Elipa',
  'Fuencarral',
]
const defaulValues = [0, 0, 0, 0, 0, 0]

watch(
  () => props.incidents,
  (newIncidents) => {
    const { labels, values } = generateDataDonnut(newIncidents)

    if (chartRef.value) {
      chartRef.value.updateOptions({
        subtitle: {
          text: `Date filter: ${String(props.subtitle)}`,
        },
      })
    }

    chartOptions.value.labels = labels.length ? labels : defaultLabels
    series.value = values.length ? values : defaulValues
  },
  { immediate: true },
)
</script>

<style lang="css" scoped></style>
