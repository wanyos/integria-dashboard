import { convertJsonToExcel } from './convert_excel.js'
import dayjs from 'dayjs'
import isBetween from './plugins/isBetween.js'
import isSameOnBefore from './plugins/isSameOnBefore.js'

dayjs.extend(isBetween)
dayjs.extend(isSameOnBefore)

// Num_Incidencia	Estado	FechaApertura	FechaCierre	Usuario	Extension	Resumen	Grupo	Tecnico_Asignado	Tipo_Inc	Descripcion_Tipo
const orderServidesk = [
  'Num_Incidencia',
  'Estado',
  'FechaApertura',
  'FechaCierre',
  'Usuario',
  'Extension',
  'Resumen',
  'Grupo',
  'Tecnico_Asignado',
  'Descripcion_Tipo',
  'Tipo_Inc',
]

// Num_Incidencia Estado FechaApertura FechaCierre Usuario Extension Resumen
// Grupo Tecnico_Asignado Descripcion_Tipo Ultima_actuacion Hora_creacion Localizacion Origen
const orderIntegria = [
  'Num_Incidencia',
  'Estado',
  'FechaApertura',
  'FechaCierre',
  'Usuario',
  'Extension',
  'Resumen',
  'Grupo',
  'Tecnico_Asignado',
  'Descripcion_Tipo',
  'Ultima_actuacion',
  'Localizacion',
]

export const createFileIss = async (servideskInc, openDate, closeDate) => {
  const result = []

  Object.keys(servideskInc).forEach((key) => {
    const incidents = servideskInc[key]
    if (incidents) {
      const keyObject = {
        tratadas: [],
        cerradas: [],
        pendientes: [],
      }

      incidents.forEach((incident) => {
        const fechaApertura = dayjs(incident.FechaApertura)
        const fechaCierre = dayjs(incident.FechaCierre)

        if (
          fechaApertura.isBetween(openDate, closeDate, null, '[]') &&
          ['Abierta', 'Cerrada', 'Fijada'].includes(incident.Estado)
        ) {
          keyObject.tratadas.push(incident)
        }

        if (
          fechaCierre.isBetween(openDate, closeDate, null, '[]') &&
          incident.Estado === 'Cerrada' &&
          incident.FechaCierre
        ) {
          keyObject.cerradas.push(incident)
        }

        if (
          fechaApertura.isSameOrBefore(openDate) &&
          ['Abierta', 'Fijada', 'Resolutor Externo'].includes(incident.Estado)
        ) {
          keyObject.pendientes.push(incident)
        }

        // Dar formato a la fecha para escribirla en Excel
        incident.FechaApertura = incident.FechaApertura ? fechaApertura.format('DD/MM/YYYY') : ''
        incident.FechaCierre = incident.FechaCierre ? fechaCierre.format('DD/MM/YYYY') : ''
      })

      result.push({ [key]: keyObject })
    }
  })

  const startDate = openDate.format('DD/MM/YYYY')
  const endDate = closeDate.format('DD/MM/YYYY')
  const filesIss = []
  for (const jsondata of result) {
    const filePath = await convertJsonToExcel(jsondata, orderServidesk, startDate, endDate)
    filesIss.push({
      name: filePath.name,
      content: filePath.content,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  }

  //   console.log('Archivos generados:', filesIss.map(f => ({
  //     name: f.name,
  //     type: f.type,
  //     contentType: f.content instanceof Uint8Array
  // })));

  return filesIss
}

export const createFileIntegria = async (integriaInc, openDate, closeDate) => {
  const result = []
  Object.keys(integriaInc).forEach((item) => {
    const incidents = integriaInc[item]

    const keyObject = {
      tratadas: [],
      cerradas: [],
      pendientes: [],
    }

    incidents.forEach((inc) => {
      const fechaApertura = dayjs(inc.FechaApertura)
      const fechaCierre = dayjs(inc.FechaCierre)

      if (
        fechaApertura.isBetween(openDate, closeDate, null, '[]') &&
        ['Nuevo', 'Cerrada', 'Asignado'].includes(inc.Estado)
      ) {
        keyObject.tratadas.push(inc)
      }

      if (
        inc.FechaCierre &&
        inc.FechaCierre.trim() !== '' &&
        fechaCierre.isBetween(openDate, closeDate, null, '[]') &&
        inc.Estado === 'Cerrada'
      ) {
        keyObject.cerradas.push(inc)
      }

      if (fechaApertura.isSameOrBefore(openDate) && ['Nuevo', 'Asignado'].includes(inc.Estado)) {
        keyObject.pendientes.push(inc)
      }

      // Dar formato a la fecha para escribirla en Excel
      inc.FechaApertura = inc.FechaApertura ? fechaApertura.format('DD/MM/YYYY') : ''
      inc.FechaCierre = inc.FechaCierre ? fechaCierre.format('DD/MM/YYYY') : ''
    })
    result.push({ [item]: keyObject })
  })

  const startDate = openDate.format('DD/MM/YYYY')
  const endDate = closeDate.format('DD/MM/YYYY')
  const filesIntegria = []
  for (const jsondata of result) {
    const file = await convertJsonToExcel(jsondata, orderIntegria, startDate, endDate)
    filesIntegria.push({
      name: file.name,
      content: file.content,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  }
  return filesIntegria
}
