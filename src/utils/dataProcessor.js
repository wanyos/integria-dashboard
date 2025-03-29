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

  // Usar un Map para agrupar datos por meses
  const groupedData = new Map()
  months.forEach((month) => {
    groupedData.set(month, new Array(31).fill(null)) // Preasignar 31 días (máximo)
  })

  // Procesar los incidentes
  incidents.forEach(({ date, count }) => {
    const incidentDate = new Date(date)
    const month = months[incidentDate.getMonth()] // Nombre del mes
    const day = incidentDate.getDate() - 1 // Día del mes como índice (0-30)

    if (groupedData.has(month)) {
      groupedData.get(month)[day] = { x: (day + 1).toString(), y: count }
    }
  })

  // Transformar a un array de series para el heatmap
  return months.map((month) => ({
    name: month,
    data: groupedData.get(month).filter((day) => day !== null), // Filtrar días nulos
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

  // Inicializar un array para almacenar el total de incidencias por mes
  const totalMonths = new Array(12).fill(0)

  // Calcular el total de incidencias por mes
  incidents.forEach(({ date, count }) => {
    const month = new Date(date).getMonth() // Obtener el mes (0-11)
    totalMonths[month] += Number(count) // Sumar el conteo al mes correspondiente
  })

  // Convertir los datos al formato requerido por el gráfico
  const seriesData = totalMonths.map((count, month) => ({
    x: monthNames[month], // Nombre del mes
    y: count, // Total de incidencias
  }))

  return [
    {
      name: 'Incidents',
      data: seriesData,
    },
  ]
}

const monthNames = [
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

/****************        generate donut avg incidents by months all years      ******************/
export const getAvgByMonths = (incidents) => {
  const totalMonths = {
    1: { total: 0, count: 0 },
    2: { total: 0, count: 0 },
    3: { total: 0, count: 0 },
    4: { total: 0, count: 0 },
    5: { total: 0, count: 0 },
    6: { total: 0, count: 0 },
    7: { total: 0, count: 0 },
    8: { total: 0, count: 0 },
    9: { total: 0, count: 0 },
    10: { total: 0, count: 0 },
    11: { total: 0, count: 0 },
    12: { total: 0, count: 0 },
  }

  // Sumar los valores de count y contar las ocurrencias para cada mes
  incidents.forEach(({ year, month, count }) => {
    if (totalMonths[month]) {
      totalMonths[month].total += count
      totalMonths[month].count += 1
    }
  })

  // Calcular el promedio para cada mes
  const values = Object.keys(totalMonths).map((month) => {
    const { total, count } = totalMonths[month]
    return count > 0 ? Math.round(total / count) : 0
  })

  //console.log('values procesor', values);
  //console.log('labels procesor', monthNames)
  return {
    labels: Array.from(monthNames),
    values: Array.from(values),
  }
}

/****************        generate rows for months table      ******************/

const createMonthsArray = () => {
  return monthNames.map((month) => ({
    counts: {},
  }))
}

export const getRowsTableByMonths = (incidents) => {
  const monthsArray = createMonthsArray()
  const years = new Set(incidents.map((incident) => incident.year))

  // Inicializar todos los meses con 0 para cada año
  monthsArray.forEach((monthObj) => {
    years.forEach((year) => {
      monthObj.counts[year] = 0
    })
  })

  // Llenar los conteos en el arreglo de meses
  incidents.forEach(({ year, month, count }) => {
    const monthIndex = month - 1 // Convertir mes a índice (0-11)
    if (monthsArray[monthIndex]) {
      monthsArray[monthIndex].counts[year] = count
    }
  })

  // Crear las filas asegurando el orden de las claves
  return monthsArray.map(({ counts }) => {
    const row = {}
    Object.keys(counts)
      .sort() // Asegurarse de que los años estén en orden ascendente
      .forEach((year) => {
        row[year] = counts[year] || 0
      })
    return row
  })
}

export const generateDataDonnut = (incidents) => {
  const labels = []
  const values = []

  if (Array.isArray(incidents)) {
    incidents.forEach((item) => {
      if (item && typeof item === 'object') {
        const keys = Object.keys(item)
        if (keys.length >= 2) {
          labels.push(item[keys[0]])
          values.push(parseInt(item[keys[1]], 10))
        }
      }
    })
  } else if (typeof incidents === 'object' && incidents !== null) {
    Object.entries(incidents).forEach(([key, value]) => {
      const t = parseInt(value, 10)
      if (t > 0) {
        labels.push(key)
        values.push(t)
      }
    })
  }
  // console.log('labels', labels)
  // console.log('values', values)
  return {
    labels: Array.from(labels),
    values: Array.from(values),
  }
}

export const generateDataGradient = (incidents) => {
  const values = []
  incidents.forEach((inc) => {
    values.push(inc.count)
  })
  return { values }
}

export const generateDataBarchart = (incidents) => {
  const values = []
  incidents.forEach((inc) => {
    values.push(inc.count)
  })
  return { values }
}

export const getRowsTableYears = (incidents) => {
  const rows = []
  for (let a = 0; a < incidents.length; a++) {
    let diff = 0
    let per = '0%'

    if (a > 0) {
      const incLast = parseInt(incidents[a - 1].count)
      diff = parseInt(incidents[a].count) - incLast
      per = ((diff / incLast) * 100).toFixed(2) + '%'
    }

    const row = {
      year: incidents[a].year,
      inc: incidents[a].count,
      tase: diff,
      percent: per,
    }
    rows.push(row)
  }
  return rows
}
