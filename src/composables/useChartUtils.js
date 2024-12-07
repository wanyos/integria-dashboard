import { ref } from 'vue'

export const useChartUtils = () => {
  const chartRef = ref(null)

  const handleMouseLeave = () => {
    // Gets the chart instance
    const chartInstance = chartRef.value?.chart
    if (chartInstance?.toolbar) {
      const menu = chartInstance.toolbar.elMenu
      if (menu && menu.classList.contains('apexcharts-menu-open')) {
        chartInstance.toolbar.toggleMenu()
      }
    }
  }

  return { chartRef, handleMouseLeave }
}
