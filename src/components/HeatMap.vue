<template>
  <div @mouseleave="handleMouseLeave" class="div__heatmap">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />
    <VueApexCharts ref="chartRef" :options="chartOptionsHeat" :series="seriesHeat" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const props = defineProps({
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

const chartRef = ref(null)
const seriesHeat = ref([])
const isLoading = ref(false)

const handleMouseLeave = () => {
  // Obtiene la instancia del chart
  const chartInstance = chartRef.value?.chart
  if (chartInstance?.toolbar) {
    const menu = chartInstance.toolbar.elMenu
    if (menu && menu.classList.contains('apexcharts-menu-open')) {
      chartInstance.toolbar.toggleMenu()
    }
  }
}

function generateHeatmapData(incidents) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  // Agrupar datos por meses y días
  const groupedData = {}

  incidents.forEach(({ date, count }) => {
    const incidentDate = new Date(date)
    const month = months[incidentDate.getMonth()] // Nombre del mes
    const day = incidentDate.getDate().toString() // Día del mes como string

    if (!groupedData[month]) {
      groupedData[month] = []
    }

    groupedData[month].push({ x: day, y: count }) // Formato requerido por el heatmap
  })

  // Transformar a un array de series para el heatmap
  return months.map((month) => ({
    name: month,
    data: groupedData[month] || [],
  }))
}

// Actualizar los datos cuando cambien las props
watch(
  () => props.incidents,
  (newIncidents) => {
    isLoading.value = true
    seriesHeat.value = generateHeatmapData(newIncidents)
    isLoading.value = false
  },
  { immediate: true },
)

const chartOptionsHeat = ref({
  chart: {
    type: 'heatmap',
    toolbar: {
      show: true,
    },
    height: 250,
    width: '100%',
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
    labels: {
      show: true,
      style: {
        fontSize: '12px',
        colors: '#1a1a1a',
      },
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
    align: 'cener',
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
    shared: true, // Habilita la visualización de varios datos compartidos
    followCursor: false,
    intersect: false,
    x: {
      show: true,
      format: 'dd MMM yyyy', // Mes y día (por ejemplo, Apr 17)
    },
    y: {
      formatter: function (val) {
        return `Inc: ${val}` // Muestra el total de incidencias
      },
      title: {
        formatter: () => '', // Evita que el título de y sea mostrado
      },
    },
    marker: {
      show: true,
    },
  },
})

watch(
  () => props.subtitle,
  (newValue) => {
    if (chartRef.value) {
      chartRef.value.updateOptions({
        subtitle: {
          text: `Year: ${String(newValue)}`,
        },
      })
    }
  },
)
</script>

<style lang="css" scoped>
.div__heatmap {
  width: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding-top: 10px;
}
</style>
