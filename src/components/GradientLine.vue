<template>
  <VueApexCharts type="line" width="100%" height="100%" :options="chartOptions" :series="series" />
</template>

<script setup>
import { ref, reactive } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const series = ref([
  {
    name: 'Total Inc',
    data: [
      0, 75, 20, 40, 12, 129, 106, 95, 8, 12, 33, 45, 0, 75, 20, 40, 12, 129, 106, 95, 8, 12, 33,
      45,
    ],
  },
])

const chartOptions = reactive({
  chart: {
    type: 'line',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: true,
    },
  },
  title: {
    text: `Incidencts by hour`,
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
  //   forecastDataPoints: {
  //     count: 7
  //   },
  stroke: {
    width: 7,
    curve: 'smooth',
  },
  colors: ['#08B545'],
  markers: {
    size: 4,
    colors: ['#fff'],
    strokeColors: ['#08B545'],
    strokeWidth: 4,
    hover: {
      size: 7,
    },
  },
  xaxis: {
    type: 'category',
    categories: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
    tickAmount: 24,
    labels: {
      rotate: -45, // Rotación para que las etiquetas se inclinen
      rotateAlways: true, // Aplica la rotación siempre
      hideOverlappingLabels: false, // Permite que las etiquetas se solapen si es necesario
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
  grid: {
    padding: {
      top: 10,
      left: 50,
      right: 50,
    },
  },
  //   title: {
  //     text: 'Forecast',
  //     align: 'left',
  //     style: {
  //       fontSize: '16px',
  //       color: '#666'
  //     }
  //   },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      gradientToColors: ['#005B26'],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100, 100],
    },
  },
})
</script>

<style lang="css" scoped></style>
