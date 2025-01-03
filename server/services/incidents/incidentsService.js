import { pool } from '../../db/mysql.js'
import QUERIES from './sqlQueries.js'

export default class IncidentsService {
  static async getIncidents() {
    try {
      const [rows] = await pool.query(QUERIES.allIncidents)
      return { status: 200, incidents: rows }
    } catch (error) {
      console.error(error)
      console.error('Database error:', error.message)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias por rango de fechas, año en curso y mismo rango año anterior. Cantidad de ellas
  static async getIncidentsRange(startDate, endDate) {
    try {
      const startDateLastYear = new Date(startDate)
      startDateLastYear.setFullYear(startDateLastYear.getFullYear() - 1)

      const endDateLastYear = new Date(endDate)
      endDateLastYear.setFullYear(endDateLastYear.getFullYear() - 1)

      const startLastYear = startDateLastYear.toISOString().split('T')[0]
      const endLastYear = endDateLastYear.toISOString().split('T')[0]

      const [openInc] = await pool.query(QUERIES.openIncidents, [startDate, endDate])
      const [closeInc] = await pool.query(QUERIES.closeIncidents, [startDate, endDate])
      const [pendingInc] = await pool.query(QUERIES.pendingIncidents, [startDate, endDate])
      const [avgInc] = await pool.query(QUERIES.avgIncidents, [startDate, endDate])

      const [openIncLastYear] = await pool.query(QUERIES.openIncidents, [
        startLastYear,
        endLastYear,
      ])
      const [closeIncLastYear] = await pool.query(QUERIES.closeIncidents, [
        startLastYear,
        endLastYear,
      ])
      const [pendingIncLastYear] = await pool.query(QUERIES.pendingIncidents, [
        startLastYear,
        endLastYear,
      ])
      const [avgIncLastYear] = await pool.query(QUERIES.avgIncidents, [startLastYear, endLastYear])

      const incidentsSummary = {
        current: {
          open: openInc[0]?.count || 0,
          close: closeInc[0]?.count || 0,
          pending: pendingInc[0]?.count || 0,
          avg: {
            // hour: avgInc[0]?.horas || 0,
            minute: avgInc[0]?.minutos || 0,
          },
        },
        lastYear: {
          open: openIncLastYear[0]?.count || 0,
          close: closeIncLastYear[0]?.count || 0,
          pending: pendingIncLastYear[0]?.count || 0,
          avg: {
            // hour: avgIncLastYear[0]?.horas || 0,
            minute: avgIncLastYear[0]?.minutos || 0,
          },
        },
      }

      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error getIncidentsRange:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // todas las incidencias de un año, abiertas y cerradas. Cantidad de ellas
  static async getIncidentsYear(currentYear) {
    try {
      const [openInc] = await pool.query(QUERIES.allIncidentsYearOpen, [currentYear])
      const [closeInc] = await pool.query(QUERIES.allIncidentsYearClose, [currentYear])
      const incidentsSummary = {
        openInc: [],
        closeInc: [],
      }

      // Procesa las incidencias abiertas
      openInc.forEach((incident) => {
        const { date, count } = incident
        incidentsSummary.openInc.push({ date, count })
      })

      // Procesa las incidencias cerradas
      closeInc.forEach((incident) => {
        const { date, count } = incident
        incidentsSummary.closeInc.push({ date, count })
      })

      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error getIncidentsYear:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias abiertas por cada grupo de cualquier fecha
  static async getOpenIncidentsGroup() {
    try {
      // const [rows] = await pool.query(QUERIES.openIncidentsGroup)
      const [rows] = await pool.query(QUERIES.openIncidentsGr)
      return { status: 200, incidents: rows }
    } catch (error) {
      console.error('Database error getOpenIncidentsGroup:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias abiertas / cerradas por rango de fechas y grupo, solo cantidades
  static async getAllIncidentsGroup(startDate, endDate) {
    try {
      const [openOperadores] = await pool.query(QUERIES.allIncOpenOperadores, [startDate, endDate])
      const [openTecnicos] = await pool.query(QUERIES.allIncOpenTecnicos, [startDate, endDate])
      const [openAdministradores] = await pool.query(QUERIES.allIncOpenAdministradores, [
        startDate,
        endDate,
      ])
      const [openCiberseguridad] = await pool.query(QUERIES.allIncOpenCiberseguridad, [
        startDate,
        endDate,
      ])
      const [openHorizontales] = await pool.query(QUERIES.allIncOpenHorizontales, [
        startDate,
        endDate,
      ])
      const [openNegocio] = await pool.query(QUERIES.allIncOpenNegocio, [startDate, endDate])
      const [openExterno] = await pool.query(QUERIES.allIncOpenExterno, [startDate, endDate])
      const [closeOperadores] = await pool.query(QUERIES.allIncCloseOperadores, [
        startDate,
        endDate,
      ])
      const [closeTecnicos] = await pool.query(QUERIES.allIncCloseTecnicos, [startDate, endDate])
      const [closeAdministradores] = await pool.query(QUERIES.allIncCloseAdministradores, [
        startDate,
        endDate,
      ])
      const [closeCiberseguridad] = await pool.query(QUERIES.allIncCloseCiberseguridad, [
        startDate,
        endDate,
      ])
      const [closeHorizontales] = await pool.query(QUERIES.allIncCloseHorizontales, [
        startDate,
        endDate,
      ])
      const [closeNegocio] = await pool.query(QUERIES.allIncCloseNegocio, [startDate, endDate])
      const [closeExterno] = await pool.query(QUERIES.allIncCloseExterno, [startDate, endDate])
      const incidentsSummary = {
        open: {
          operadores: openOperadores[0]?.count || 0,
          tecnicos: openTecnicos[0].count || 0,
          administradores: openAdministradores[0]?.count || 0,
          ciberseguridad: openCiberseguridad[0]?.count || 0,
          horizontales: openHorizontales[0]?.count || 0,
          negocio: openNegocio[0]?.count || 0,
          externo: openExterno[0]?.count || 0,
        },
        close: {
          operadores: closeOperadores[0]?.count || 0,
          tecnicos: closeTecnicos[0]?.count || 0,
          administradores: closeAdministradores[0]?.count || 0,
          ciberseguridad: closeCiberseguridad[0]?.count || 0,
          horizontales: closeHorizontales[0]?.count || 0,
          negocio: closeNegocio[0]?.count || 0,
          externo: closeExterno[0]?.count || 0,
        },
      }
      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error getAllIncidentsGroup:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias abiertas en rango de fechas por localizacion, cantidad de cada localización
  static async getAllIncLocationRange(startDate, endDate) {
    const locations = {
      pacifico: ['PACIFICO', 'CERRO PLATA'],
      fuencarral: 'FUENCARRAL',
      la_elipa: 'LA ELIPA',
      carabanchel: 'CARABANCHEL',
      entrevias: 'ENTREVIAS',
      sanchinarro: 'SANCHINARRO',
    }

    // const selectedGroup = locations.pacifico
    // const placeholders = selectedGroup.map(() => '?').join(', ')
    // const query = QUERIES.allIncLocationRange.replace('%IN_PLACEHOLDER%', placeholders)

    try {
      // const [incPacifico] = await pool.query(query, [startDate, endDate, ...selectedGroup])
      // const [incFuencarral] = await pool.query(QUERIES.allIncLocationRange, [
      //   startDate,
      //   endDate,
      //   locations.fuencarral,
      // ])
      // const [incLaElipa] = await pool.query(QUERIES.allIncLocationRange, [
      //   startDate,
      //   endDate,
      //   locations.la_elipa,
      // ])
      // const [incCarabanchel] = await pool.query(QUERIES.allIncLocationRange, [
      //   startDate,
      //   endDate,
      //   locations.carabanchel,
      // ])
      // const [incEntrevias] = await pool.query(QUERIES.allIncLocationRange, [
      //   startDate,
      //   endDate,
      //   locations.entrevias,
      // ])
      // const [incSanchinarro] = await pool.query(QUERIES.allIncLocationRange, [
      //   startDate,
      //   endDate,
      //   locations.sanchinarro,
      // ])
      // const incidentsSummary = {
      //   pacifico: incPacifico[0]?.total || 0,
      //   fuencarral: incFuencarral[0]?.total || 0,
      //   la_elipa: incLaElipa[0]?.total || 0,
      //   carabanchel: incCarabanchel[0]?.total || 0,
      //   entrevias: incEntrevias[0]?.total || 0,
      //   sanchinarro: incSanchinarro[0]?.total || 0,
      // }

      const [results] = await pool.query(QUERIES.allIncLocationRange, [startDate, endDate]);
      const incidentsSummary = {
        pacifico: results[0]?.pacifico || 0,
        fuencarral: results[0]?.fuencarral || 0,
        la_elipa: results[0]?.la_elipa || 0,
        carabanchel: results[0]?.carabanchel || 0,
        entrevias: results[0]?.entrevias || 0,
        sanchinarro: results[0]?.sanchinarro || 0,
      };

      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error getAllIncLocationRange:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias abiertas en rango de fechas por bases, cantidad de cada base
  static async getAllIncBasesRange(startDate, endDate) {
    // const bases = {
    //   Colon: ['%Colon%', '%%'],
    //   Escuadron: ['%Escuadron%', '%%'],
    //   Mediodia2: ['%Mediodia%', '%2%'],
    //   Mediodia3: ['%Mediodia%', '%3%'],
    //   Recuerdo: ['%Ntra%', '%Recuerdo%'],
    //   Imperial: ['%Imperial%', '%%'],
    //   Vicalvaro: ['%Vicalvaro%', '%%'],
    // }

    try {

      const [results] = await pool.query(QUERIES.allIncBasesRange, [startDate, endDate]);

    const incidentsSummary = {
      colon: results[0]?.Colon || 0,
      escuadron: results[0]?.Escuadron || 0,
      mediodia2: results[0]?.Mediodia2 || 0,
      mediodia3: results[0]?.Mediodia3 || 0,
      recuerdo: results[0]?.Recuerdo || 0,
      imperial: results[0]?.Imperial || 0,
      vicalvaro: results[0]?.Vicalvaro || 0,
    };

      // const valuesColon = [ bases.Colon[0], bases.Colon[1], startDate, endDate,]
      // const [incColon] = await pool.query(QUERIES.allIncBasesRange, valuesColon)

      // const [incEscuadron] = await pool.query(QUERIES.allIncBasesRange, [
      //   bases.Escuadron[0],
      //   bases.Escuadron[1],
      //   startDate,
      //   endDate,
      // ])
      // const [incMediodia2] = await pool.query(QUERIES.allIncBasesRange, [
      //   bases.Mediodia2[0],
      //   bases.Mediodia2[1],
      //   startDate,
      //   endDate,

      // ])
      // const [incMediodia3] = await pool.query(QUERIES.allIncBasesRange, [
      //   bases.Mediodia3[0],
      //   bases.Mediodia3[1],
      //   startDate,
      //   endDate,

      // ])
      // const [incRecuerdo] = await pool.query(QUERIES.allIncBasesRange, [
      //   bases.Recuerdo[0],
      //   bases.Recuerdo[1],
      //   startDate,
      //   endDate,

      // ])
      // const [incImperial] = await pool.query(QUERIES.allIncBasesRange, [
      //   bases.Imperial[0],
      //   bases.Imperial[1],
      //   startDate,
      //   endDate,

      // ])
      // const [incVicalvaro] = await pool.query(QUERIES.allIncBasesRange, [
      //   bases.Vicalvaro[0],
      //   bases.Vicalvaro[1],
      //   startDate,
      //   endDate,

      // ])

      // const incidentsSummary = {
      //   colon: incColon[0]?.total || 0,
      //   escuadron: incEscuadron[0]?.total || 0,
      //   // mediodia2: incMediodia2[0]?.total || 0,
      //   // mediodia3: incMediodia3[0]?.total || 0,
      //   // recuerdo: incRecuerdo[0]?.total || 0,
      //   // imperial: incImperial[0]?.total || 0,
      //   // vicalvaro: incVicalvaro[0]?.total || 0,
      // }
      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error getAllIncBasesRange:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }
}
