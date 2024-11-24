<template>
  <div class="chart">
    <v-chart :option="option" autoresize />
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
import { ref, provide } from 'vue'

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

const option = ref({
  title: {
    text: 'Incidencias Abiertas en el Último Año',
    subtext: 'Distribución por Departamento y Días Abiertos',
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '7%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return `Incidencia ID: ${params.name}<br/>Días abiertos: ${params.value[1]}<br/>Departamento: ${params.seriesName}`
    },
  },
  xAxis: {
    type: 'category',
    data: ['67987', '57894', '23456', '12345', '98765', '43210', '67890'], // IDs de incidencia
    axisLabel: {
      rotate: 45, // Inclinación de etiquetas
    },
    axisTick: {
      show: false,
    },
    boundaryGap: true,
  },
  yAxis: {
    type: 'value',
    min: 0, // Valor mínimo del eje Y
    max: 250, // Valor máximo del eje Y
    interval: null, // No usamos intervalos automáticos
    axisLabel: {
      formatter: '{value} días',
    },
    splitLine: {
      show: true,
    },
    data: [10, 20, 30, 50, 100, 150, 200, 250], // Rangos personalizados
  },
  series: [
    {
      name: 'Soporte',
      type: 'scatter',
      data: [
        ['67987', 10],
        ['43210', 15],
      ], // Datos del departamento Soporte
      symbolSize: 10,
      itemStyle: {
        color: '#FF6F61', // Color del departamento Soporte
      },
    },
    {
      name: 'Desarrollo',
      type: 'scatter',
      data: [
        ['57894', 20],
        ['23456', 50],
        ['12345', 100],
      ], // Datos del departamento Desarrollo
      symbolSize: 10,
      itemStyle: {
        color: '#6B8E23', // Color del departamento Desarrollo
      },
    },
    {
      name: 'Ventas',
      type: 'scatter',
      data: [
        ['98765', 200],
        ['67890', 150],
      ], // Datos del departamento Ventas
      symbolSize: 10,
      itemStyle: {
        color: '#20B2AA', // Color del departamento Ventas
      },
    },
  ],
  toolbox: {
    show: false,
  },
  legend: {
    data: ['Soporte', 'Desarrollo', 'Ventas'],
    orient: 'vertical',
    left: 'right',
  },
})

// const option = ref({
//   title: {
//     text: 'Weight distribution of sent and received mail',
//     subtext: '',
//   },

//   grid: {
//     left: '5%',
//     right: '5%',
//     bottom: '7%',
//     containLabel: true,
//   },
//   tooltip: {
//     // trigger: 'axis',
//     showDelay: 0,
//     formatter: function (params) {
//       if (params.value.length > 1) {
//         return (
//           params.seriesName + ' :<br/> Día ' + params.value[0] + ' - ' + params.value[1] + ' KB'
//         )
//       } else {
//         return params.seriesName + ' :<br/> ' + params.name + ' : ' + params.value + ' KB'
//       }
//     },
//     axisPointer: {
//       show: true,
//       type: 'cross',
//       lineStyle: {
//         type: 'dashed',
//         width: 1,
//       },
//     },
//   },
//   toolbox: {
//     show: true, // Muestra el toolbox
//     feature: {
//       saveAsImage: {
//         show: true, // Habilita la opción de guardar la imagen
//         title: 'Save as Image', // Título del botón
//         type: 'png', // Formato de imagen, puede ser 'png', 'jpeg', etc.
//         pixelRatio: 2, // Calidad de la imagen exportada
//         backgroundColor: '#ffffff', // Fondo de la imagen
//       },
//     },
//   },
//   brush: {},
//   legend: {
//     data: ['Sent', 'Received'],
//     left: 'center',
//     bottom: -5,
//   },

//   xAxis: [
//     {
//       type: 'category',
//       data: Array.from({ length: 31 }, (_, i) => i + 1),
//       boundaryGap: true,
//       axisLabel: {
//         show: true,
//         interval: 0,
//         rotate: 0,
//         margin: 8,
//       },
//       axisTick: {
//         show: true,
//         alignWithLabel: true,
//         interval: 0,
//       },
//       splitLine: {
//         show: false,
//       },
//     },
//   ],
//   yAxis: [
//     {
//       type: 'value',
//       scale: true,
//       axisLabel: {
//         formatter: '{value} KB',
//       },
//       splitLine: {
//         show: false,
//       },
//     },
//   ],
//   series: [
//     {
//       name: 'Sent',
//       type: 'scatter',
//       emphasis: {
//         focus: 'series',
//       },
//       itemStyle: {
//         color: '#08B545', // Color para la serie "Sent"
//       },

//       data: [
//         [14, 43.2],
//         [29, 97.8],
//         [3, 109.6],
//         [10, 53.7],
//         [28, 126.5],
//         [16, 123.9],
//         [30, 43.4],
//         [3, 98.1],
//         [23, 84.0],
//         [13, 63.5],
//         [15, 183.4],
//         [24, 143.6],
//         [21, 190.6],
//         [19, 87.8],
//         [5, 109.9],
//         [6, 256.4],
//         [8, 180.2],
//         [12, 32.5],
//         [18, 67.9],
//         [22, 132.8],
//         [9, 75.4],
//         [7, 210.1],
//         [20, 55.0],
//         [25, 98.3],
//         [4, 45.7],
//         [11, 117.0],
//         [26, 120.8],
//         [27, 168.9],
//       ],

//       markArea: {
//         silent: true,
//         itemStyle: {
//           color: 'transparent',
//           borderWidth: 1,
//           borderType: 'dashed',
//         },
//         data: [
//           [
//             {
//               name: 'Sent Data Range',
//               xAxis: 'min',
//               yAxis: 'min',
//             },
//             {
//               xAxis: 'max',
//               yAxis: 'max',
//             },
//           ],
//         ],
//       },
//       markPoint: {
//         data: [
//           { type: 'max', name: 'Max' },
//           { type: 'min', name: 'Min' },
//         ],
//       },
//       markLine: {
//         lineStyle: {
//           type: 'solid',
//         },
//         data: [{ type: 'average', name: 'AVG' }, { xAxis: 160 }],
//       },
//     },
//     {
//       name: 'Received',
//       type: 'scatter',
//       emphasis: {
//         focus: 'series',
//       },
//       itemStyle: {
//         color: '#0096FB', // Color para la serie "Received"
//       },

//       data: [
//         [1, 68.5],
//         [2, 52.2],
//         [3, 135.6],
//         [4, 95.3],
//         [5, 144.7],
//         [6, 118.3],
//         [7, 43.9],
//         [8, 127.1],
//         [9, 58.4],
//         [10, 140.1],
//         [11, 74.9],
//         [12, 156.4],
//         [13, 49.3],
//         [14, 112.0],
//         [15, 138.7],
//         [16, 166.4],
//         [17, 86.3],
//         [18, 65.1],
//         [19, 111.4],
//         [20, 116.9],
//         [21, 83.2],
//         [22, 92.4],
//         [23, 150.8],
//         [24, 113.7],
//         [25, 141.3],
//         [26, 51.0],
//         [27, 120.2],
//         [28, 96.0],
//         [29, 128.4],
//         [30, 72.7],
//         [31, 158.5],
//       ],
//       markArea: {
//         silent: true,
//         itemStyle: {
//           color: 'transparent',
//           borderWidth: 1,
//           borderType: 'dashed',
//         },
//         data: [
//           [
//             {
//               name: 'Received Data Range',
//               xAxis: 'min',
//               yAxis: 'min',
//             },
//             {
//               xAxis: 'max',
//               yAxis: 'max',
//             },
//           ],
//         ],
//       },
//       markPoint: {
//         data: [
//           { type: 'max', name: 'Max' },
//           { type: 'min', name: 'Min' },
//         ],
//       },
//       markLine: {
//         lineStyle: {
//           type: 'solid',
//         },
//         data: [{ type: 'average', name: 'Average' }, { xAxis: 170 }],
//       },
//     },
//   ],
// })
</script>

<style scoped>
.chart {
  padding: 25px;
}
</style>
