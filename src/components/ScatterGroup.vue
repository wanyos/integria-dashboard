<template>
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
import { ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useChartUtils } from '@/composables/useChartUtils'

const props = defineProps({
  allIncidents: {
    type: Array,
    default: () => [],
  },
})

// const series = ref([
//   {
//     name: 'Operadores',
//     data: [{ x: 0, y: 10, id: '12345' }],
//   },
//   {
//     name: 'Técnicos',
//     data: [{ x: 1, y: 320, id: '23456' }],
//   },
//   {
//     name: 'Administradores',
//     data: [
//       { x: 2, y: 170, id: '34567' }, // Ensure y value is capped at 250
//     ],
//   },
//   {
//     name: 'Ciberseguridad',
//     data: [{ x: 3, y: 40, id: '45678' }],
//   },
// ])

const { chartRef, handleMouseLeave } = useChartUtils()
const seriesData = ref([])

const chartOptions = ref({
  chart: {
    type: 'scatter',
    zoom: {
      enabled: false,
      type: 'xy',
    },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
  },
  colors: ['#ee975f', '#7fba57', '#537ba4', '#8d3d75'],
  title: {
    text: 'Days of open incidents', // Título del gráfico
    align: 'left', // Alineación (left, center, right)
    margin: 0, // Margen superior
    style: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#1a1a1a',
    },
  },
  subtitle: {
    text: 'Distribution by department', // Subtítulo
    align: 'left', // Alineación
    margin: 0, // Margen superior al gráfico
    style: {
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#666',
    },
  },
  xaxis: {
    type: 'category',
    categories: ['Operadores', 'Técnicos', 'Administradores', 'Ciberseguridad'],
    tickPlacement: 'between', // Place ticks between categories
    offsetX: 0, // Move the x-axis labels to the right
    range: 3, // Adjust the range to bring the columns closer
    tickAmount: undefined,
    labels: {
      // show: true, // Oculta las etiquetas del eje x
      // rotate: 0, // Rotate labels by -45 degrees
      formatter: function (value) {
        const abbreviations = ['Ope', 'Tec', 'Adm', 'Cib']
        return abbreviations[value] || ''
      },
    },
    tooltip: {
      enabled: false, // Desactiva la etiqueta adicional del eje X
    },
    axisTicks: {
      show: false, // Oculta las marcas en el eje x
    },
    axisBorder: {
      show: true, // Oculta la línea del eje x
    },
  },
  yaxis: {
    min: 0, // Valor mínimo del eje Y
    max: 700, // Valor máximo del eje Y
    tickAmount: undefined, // Remove fixed tick amount to allow more flexible scaling
    labels: {
      style: {
        fontSize: '12px', // Increase font size for y-axis labels
      },
      formatter: function (value) {
        // Customize labels based on value ranges
        if (value <= 900) {
          return `${value} days` // Detailed labels for 0-200 range
        } else {
          return value % 1000 === 0 ? `${value} days` : '' // Only show labels at 1000 increments above 200
        }
      },
    },
    tickValues: [
      // Create a more granular tick distribution
      0, 10, 15, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 600, 1000,
    ],
    splitLine: {
      show: true,
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '12px', // Increase font size for legend
  },
  grid: {
    show: true,
    borderColor: '#f1f1f1',
    padding: {
      top: 20,
      right: 70,
      bottom: 20,
      left: 70,
    },
  },
  tooltip: {
    y: {
      title: {
        formatter: () => '', // Elimina el título (categoría)
      },
      formatter: function (value) {
        return `Días: ${value}` // Solo muestra el número de días
      },
    },
    x: {
      formatter: function (value, { seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
        return `ID: ${data.id}`
      },
    },
  },
})

watch(
  () => props.allIncidents,
  (newIncidents) => {
    seriesData.value = newIncidents
  },
  { immediate: true },
)
</script>

<style lang="css" scoped></style>
