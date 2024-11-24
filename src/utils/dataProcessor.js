import dayjs from 'dayjs'

export function buildChartData(incidencias) {
  const chartData = {}

  incidencias.forEach((incidencia) => {
    const { id_grupo, id_incidencia, inicio } = incidencia
    const daysOpen = dayjs().diff(dayjs(inicio), 'day')

    if (!chartData[id_grupo]) {
      chartData[id_grupo] = []
    }

    chartData[id_grupo].push([id_incidencia, daysOpen])
  })

  return chartData
}
