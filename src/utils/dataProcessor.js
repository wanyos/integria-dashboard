import dayjs from 'dayjs'

/****************        generate objects serie for chart distrubution incidents open groups     ******************/
export function buildChartData(incidents) {
  const groupedData = {
    Operadores: [],
    Técnicos: [],
    Administradores: [],
    Ciberseguridad: [],
  }
  incidents.forEach((incident) => {
    const group = getGroupName(incident.id_grupo)
    const daysOpen = calculateDaysOpen(incident.inicio)

    if (group) {
      groupedData[group].push([incident.id_incidencia, daysOpen])
    }
  })
  // console.log('groupedData', groupedData)
  return groupedData
}
function calculateDaysOpen(startDate) {
  const start = dayjs(startDate)
  const now = dayjs()
  const diffDays = now.diff(start, 'day')
  return diffDays
}
function getGroupName(groupId) {
  switch (groupId) {
    case 2:
      return 'Operadores'
    case 7:
      return 'Técnicos'
    case 8:
      return 'Administradores'
    case 148:
      return 'Ciberseguridad'
    default:
      return null
  }
}

/****************        generate objects serie for chart heatmaps     ******************/
export function generateHeatmapData(incidents) {
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

/****************        generate objects serie for chart scatter distribution groups days open incidents      ******************/
// Definimos los grupos y sus correspondientes IDs
const GRUPOS = {
  Operadores: 2,
  Técnicos: 7,
  Administradores: 8,
  Ciberseguridad: 148,
}
export const generateDataScatterGroup = (incidencias) => {
  // Inicializamos las series con los nombres de los grupos
  const series = Object.keys(GRUPOS).map((grupo, index) => ({
    name: grupo,
    data: [], // Inicialmente vacío
  }))
  // Procesamos cada incidencia
  incidencias.forEach((incidencia) => {
    const { id_grupo, id_incidencia, inicio } = incidencia
    // Encontramos el grupo correspondiente
    const grupoIndex = Object.values(GRUPOS).indexOf(id_grupo)
    if (grupoIndex !== -1) {
      const dias = calculateDaysOpen(inicio) // Calculamos los días
      series[grupoIndex].data.push({
        x: grupoIndex, // El índice del grupo en el eje X
        y: dias, // Días calculados
        id: id_incidencia, // ID de la incidencia
      })
    }
  })
  // console.log('serie scattter', series)
  return series
}

/****************        generate objects serie for chart stakedbar open and closed incidents      ******************/
export function generateDataStakedBar(allIncidentsGroup) {
  const categories = []
  const openData = []
  const closeData = []
  for (const key in allIncidentsGroup.open) {
    categories.push(key)
    let v_open = allIncidentsGroup.open[key]
    openData.push(v_open)
    let v_close = allIncidentsGroup.close[key]
    closeData.push(v_close)
  }
  const data = [
    {
      name: 'Abiertas',
      data: openData,
    },
    {
      name: 'Cerradas',
      data: closeData,
    },
  ]
  const totalData = {
    groups: categories,
    incidents: data,
  }
  return totalData
}

/****************        generate objects serie for chart areabar incidents by months      ******************/
export const generateAreapData = (incidents) => {
  // Convertir el objeto totalMonths a un array de objetos para el gráfico
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const totalMonths = {
    0: { count: 0 },
    1: { count: 0 },
    2: { count: 0 },
    3: { count: 0 },
    4: { count: 0 },
    5: { count: 0 },
    6: { count: 0 },
    7: { count: 0 },
    8: { count: 0 },
    9: { count: 0 },
    10: { count: 0 },
    11: { count: 0 },
  }

  for (const key in incidents) {
    let month = dayjs(incidents[key].date).month()
    totalMonths[month].count += Number(incidents[key].count)
  }

  const seriesData = Object.keys(totalMonths).map((month) => ({
    x: monthNames[month],
    y: totalMonths[month].count,
  }))

  return [
    {
      name: 'Incidents',
      data: seriesData,
    },
  ]
}

/****************        generate objects serie for chart donnut places incidents      ******************/
export const generateDataDonnut = (incidents) => {
  const labels = []
  const values = []
  Object.entries(incidents).forEach(([key, value]) => {
    labels.push(key)
    values.push(parseInt(value, 10))
  })
  return {
    labels: Array.from(labels),
    values: Array.from(values),
  }
}
