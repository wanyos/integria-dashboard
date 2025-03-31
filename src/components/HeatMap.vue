<template>
  <div class="div-container">
    <!-- <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
      class="loading-container"
    /> -->
    <VueApexCharts
      ref="chartRef"
      width="100%"
      height="100%"
      :options="chartOptionsHeat"
      :series="seriesHeat"
      @mouse-leave="handleMouseLeave"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useChartUtils } from '@/composables/useChartUtils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const props = defineProps({
  id: {
    type: String,
    default: 'heatmap',
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: [String, Number],
    default: '',
  },
  colors: {
    type: Array,
    default: () => ['#E3F2FD', '#90CAF9', '#42A5F5', '#1565C0'],
  },
  incidents: {
    type: Array,
    default: () => [],
  },
})

const { chartRef, handleMouseLeave } = useChartUtils()
const seriesHeat = ref([])
const isLoading = ref(false)

onMounted(() => {
  isLoading.value = true
})

const chartOptionsHeat = ref({
  chart: {
    type: 'heatmap',
    toolbar: {
      show: true,
    },
  },
  grid: {
    padding: {
      top: 0,
      right: 20,
      bottom: 0,
      left: 20,
    },
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      radius: 0, // Ajusta el borde de las celdas (0 = cuadrado)
      distributed: true, // Distribuye uniformemente
      colorScale: {
        ranges: [
          { from: 0, to: 10, color: props.colors[0], name: '0-10' },
          { from: 11, to: 20, color: props.colors[0], name: '10-20' },
          { from: 21, to: 40, color: props.colors[1], name: '21-40' },
          { from: 41, to: 60, color: props.colors[2], name: '41-60' },
          { from: 61, to: 100, color: props.colors[3], name: '61-100' },
          { from: 101, to: 400, color: props.colors[4], name: '+100' },
        ],
      },
    },
  },
  xaxis: {
    type: 'category',
    categories: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
    labels: {
      show: true,
      style: {
        fontSize: '12px',
        colors: '#1a1a1a',
      },
    },
    tooltip: {
      enabled: false, // Desactiva la etiqueta adicional del eje X
    },
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        fontSize: '12px',
        colors: '#1a1a1a',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['#F44336'],
  title: {
    text: props.title,
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
  legend: {
    position: 'bottom',
  },
  tooltip: {
    enabled: true,
    shared: true,
    followCursor: false,
    intersect: false,
    x: {
      show: true,
      formatter: (value, { seriesIndex, dataPointIndex, w }) => {
        // Obtén el mes desde el nombre de la serie
        const month = w.config.series[seriesIndex].name
        return `${month} ${value}` // Ejemplo: "Apr 17"
      },
    },
    y: {
      formatter: (val) => `Inc: ${val}`,
      title: {
        formatter: () => '', // No muestra título para "y"
      },
    },
    marker: {
      show: true,
    },
  },
})

watch(
  () => props.incidents,
  async (newIncidents) => {
    isLoading.value = true
    seriesHeat.value = newIncidents
    await nextTick()

    chartOptionsHeat.value = {
      ...chartOptionsHeat.value,
      subtitle: {
        text: `Year: ${props.subtitle}`,
      },
    }
    isLoading.value = false
  },
  { immediate: true },
)
</script>
<style lang="css" scoped>
.div-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
