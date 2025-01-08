<template>
  <VueApexCharts ref="chartRef" type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useChartUtils } from '@/composables/useChartUtils'
import { generateDataBarchart } from '../utils/dataProcessor'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: '',
  },
  incidents: {
    type: Array,
    default: () => []
  }
})

const { chartRef } = useChartUtils()
const series = ref([
  {
    name: 'Total Inc',
    data: [0, 75, 20, 40, 12, 129, 106],
  },
])

const chartOptions = ref({
  chart: {
    type: 'bar',
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
      left: 30,
      right: 30,
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

const defaulValues = [0,0,0,0,0,0,0,0,0]

watch(
  () => props.incidents,
  async (newIncidents) => {
    const { values } = generateDataBarchart(newIncidents)
    await nextTick()

    chartOptions.value = {
      ...chartOptions.value,
      subtitle: {
        text: `${String(props.subtitle)}`,
      },
      yaxis: {
        max: values.length ? Math.ceil(Math.max(...values)) + 50 : 100
      }
    }
    series.value[0].data = values.length ? [...values] : defaulValues
  },
  { immediate: true },
)


</script>

<style lang="css" scoped></style>
