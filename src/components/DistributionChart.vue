<template>
  <div class="div__chart">
    <v-chart :option="option" class="chart" autoresize />
  </div>
</template>

<script setup>
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
import { ref, provide, watch, reactive, computed } from 'vue'
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

const props = defineProps({
  allIncidents: {
    type: Array,
    default: () => [],
  },
})

const isLoading = ref(false)
const chartData = reactive({})

// Watch for changes in allIncidents and update chartData
watch(
  () => props.allIncidents,
  (newIncidents) => {
    Object.assign(chartData, buildChartData(newIncidents))
  },
  { immediate: true },
)

const option = ref({
  title: {
    text: 'Days of open incidents',
    subtext: 'Distribution by department',
    left: 'left', // Center the title horizontally
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal',
      color: '#1a1a1a',
      padding: [0, 0, 0, 20], // [Arriba, Derecha, Abajo, Izquierda]
    },
    subtextStyle: {
      fontSize: 12,
      color: '#666',
      padding: [0, 0, 0, 20], // Espaciado adicional para el subtítulo
    },
  },
  grid: {
    top: '20%', // Ajusta el espacio entre el título y el chart
    left: '5%',
    right: '5%',
    bottom: '10%', // Ajusta el espacio inferior para la leyenda
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
  series: computed(() =>
    Object.keys(chartData).map((group) => ({
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
                : group === 'Ciberseguridad'
                  ? '#9460ba'
                  : '#20B2BB',
      },
    })),
  ),
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
</script>

<style lang="css" scoped>
.div__chart {
  padding: 10px;
}
</style>
