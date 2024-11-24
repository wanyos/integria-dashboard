<template>
  <div class="chart">
    <v-chart :option="option" autoresize />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide } from 'vue'
import { buildChartData } from '../utils/dataProcessor'

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
])

provide(THEME_KEY, 'light')

// Mock data for incidencias
const incidencias = [
  { id_grupo: 'Operadores', id_incidencia: '67987', inicio: '2023-01-01' },
  { id_grupo: 'Operadores', id_incidencia: '43210', inicio: '2023-02-01' },
  { id_grupo: 'Técnicos', id_incidencia: '57894', inicio: '2022-12-01' },
  { id_grupo: 'Técnicos', id_incidencia: '23456', inicio: '2023-03-01' },
  { id_grupo: 'Técnicos', id_incidencia: '12345', inicio: '2023-04-01' },
  { id_grupo: 'Administradores', id_incidencia: '48765', inicio: '2023-05-01' },
  { id_grupo: 'Administradores', id_incidencia: '67890', inicio: '2023-06-01' },
  { id_grupo: 'Ciberseguridad', id_incidencia: '57765', inicio: '2023-07-01' },
  { id_grupo: 'Ciberseguridad', id_incidencia: '67890', inicio: '2023-08-01' },
  { id_grupo: 'Ciberseguridad', id_incidencia: '12345', inicio: '2023-09-01' },
]

const chartData = buildChartData(incidencias)

const option = ref({
  title: {
    text: 'Days of open incidents',
    subtext: 'Distribution by department',
  },
  grid: {
    top: '20%', // Ajusta el espacio entre el título y el chart
    left: '5%',
    right: '5%',
    bottom: '15%', // Ajusta el espacio inferior para la leyenda
    containLabel: true,
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      const originalValue = params.data[2] || params.data[1] // Use the original value if available
      return `ID: ${params.data[0]}<br/>Days: ${originalValue}<br/>${params.seriesName}`
    },
  },
  xAxis: {
    type: 'value', // Cambia a 'value' para representar un rango continuo
    min: 10000, // Valor mínimo del eje X
    max: 80000, // Valor máximo del eje X
    interval: 5000, // Intervalo más pequeño para mostrar más etiquetas
    axisLabel: {
      formatter: '{value}', // Formato de las etiquetas
      rotate: 45, // Inclinación de etiquetas
    },
    axisTick: {
      show: false,
    },
    boundaryGap: false,
    splitLine: {
      show: false, // Oculta las líneas del grid
    },
  },
  yAxis: {
    type: 'value',
    min: 0, // Valor mínimo del eje Y
    max: 250, // Valor máximo del eje Y
    interval: 25, // Intervalo más pequeño
    axisLabel: {
      formatter: function (value) {
        return value >= 250 ? '+250 days' : `${value} days`
      },
    },
    splitLine: {
      show: true,
    },
    data: [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250], // Rangos personalizados más pequeños
  },
  series: Object.keys(chartData).map((group) => ({
    name: group,
    type: 'scatter',
    data: chartData[group].map((item) => [item[0], item[1] > 250 ? 250 : item[1], item[1]]), // Store original value
    symbolSize: 10,
    itemStyle: {
      color:
        group === 'Operadores'
          ? '#FF6F61'
          : group === 'Técnicos'
            ? '#6B8E23'
            : group === 'Administradores'
              ? '#20B2AA'
              : '#20B2BB',
    },
  })),
  toolbox: {
    show: true, // Muestra el toolbox
    feature: {
      saveAsImage: {
        show: true, // Habilita la opción de guardar la imagen
        title: 'Save as Image', // Título del botón
        type: ['png', 'jpeg', 'svg'], // Formatos de imagen disponibles
        pixelRatio: 2, // Calidad de la imagen exportada
        backgroundColor: '#ffffff', // Fondo de la imagen
      },
    },
  },
  legend: {
    data: ['Operadores', 'Técnicos', 'Administradores', 'Ciberseguridad'], // Incluye el nuevo departamento
    orient: 'horizontal',
    left: 'center',
    bottom: 0, // Posiciona la leyenda en la parte inferior
  },
})

onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleWheel)
})

function handleWheel(event) {
  // Handle the wheel event
}
</script>

<style scoped>
.chart {
  padding: 25px;
}
</style>
