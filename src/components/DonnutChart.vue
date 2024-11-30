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
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({})

const series = ref([14, 32, 12, 9, 5, 23])

const chartOptions = ref({
  chart: {
    type: 'donut',
  },
  labels: ['Pacifico', 'Carabacnhel', 'Entrevias', 'Sanchinarro', 'La Elipa', 'Fuencarral'],
  colors: ['#0096FB', '#8DBCFD', '#CCEAFE', '#A3E4D7', '#F9E79F', '#F5CBA7', '#D7BDE2', '#AED6F1'],
  grid: {
    padding: {
      top: 30,
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
</script>

<style lang="css" scoped></style>
