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
import { nextTick, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useChartUtils } from '@/composables/useChartUtils'
import { COLORS } from '@/constants/constants.js'

const props = defineProps({
  id: {
    type: String,
    default: 'donut',
  },
  incidents: {
    type: Object,
    default: () => {},
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  labels: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

// const series = ref([14, 32, 12, 9, 5, 23])
const { chartRef } = useChartUtils()
const series = ref(props.data)

const chartOptions = ref({
  chart: {
    id: `${props.id}`,
    type: 'donut',
  },
  labels: props.labels,
  colors: props.options.colors || COLORS,
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
        labels: {
          show: true,

          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              return `${total} Inc`
            },
          },
        },
      },
    },
  },
  // dataLabels: {
  //   enabled: true,
  //   formatter: function (val) {
  //     return `${val.toFixed(1)}%`
  //   },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      const total = opts.w.globals.series[opts.seriesIndex]
      return `${total} Inc`
    },
    style: {
      fontSize: '12px',
      fontWeight: 'normal',
      colors: ['#1a1a1a'],
    },
    dropShadow: {
      enabled: false,
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
    enabled: false,
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

const defaulValues = [0, 0, 0, 0, 0, 0]

watch(
  () => props.incidents,
  async (newIncidents) => {
    const { labels, values } = newIncidents
    await nextTick()
    chartOptions.value = {
      ...chartOptions.value,
      subtitle: {
        text: `${String(props.subtitle)}`,
      },
      labels: [...labels],
    }
    series.value = values.length ? [...values] : defaulValues
  },
  { immediate: true },
)
</script>

<style lang="css" scoped></style>
