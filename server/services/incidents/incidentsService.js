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
      const [openByGroup] = await pool.query(QUERIES.allIncOpenByGroup, [startDate, endDate]);
      const [closeByGroup] = await pool.query(QUERIES.allIncCloseByGroup, [startDate, endDate]);
      const incidentsSummary = {
        open: {
          operadores: 0,
          tecnicos: 0,
          administradores: 0,
          ciberseguridad: 0,
          horizontales: 0,
          negocio: 0,
          externo: 0,
        },
        close: {
          operadores: 0,
          tecnicos: 0,
          administradores: 0,
          ciberseguridad: 0,
          horizontales: 0,
          negocio: 0,
          externo: 0,
        },
      }

      const groupMapping = {
        'Operadores': 'operadores',
        'Tecnicos': 'tecnicos',
        'Administradores': 'administradores',
        'Ciberseguridad': 'ciberseguridad',
        'Apl.Horizontales': 'horizontales',
        'Apl.Negocio': 'negocio',
        'Tec.Externo': 'externo',
      };

      openByGroup.forEach(row => {
        const groupKey = groupMapping[row.grupo];
        if (groupKey) {
          incidentsSummary.open[groupKey] = row.count;
        }
      });

      closeByGroup.forEach(row => {
        const groupKey = groupMapping[row.grupo];
        if (groupKey) {
          incidentsSummary.close[groupKey] = row.count;
        }
      });

      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error getAllIncidentsGroup:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias abiertas en rango de fechas por localizacion, cantidad de cada localización
  static async getAllIncLocationRange(startDate, endDate) {
    try {
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

      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error getAllIncBasesRange:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias abiertas en rango de fechas por aparcamientos, cantidad de ellas
  static async getAllIncParkingRange(startDate, endDate) {
    try {
      const [results] = await pool.query(QUERIES.allIncParkingRange, [startDate, endDate]);

      const incidentsSummary = {
        almagro: results[0]?.Almagro || 0,
        avdPortugal: results[0]?.AvdPortugal || 0,
        canalejas: results[0]?.Canalejas || 0,
        fuencarral123: results[0]?.Fuencarral123 || 0,
        benavente: results[0]?.Benavente || 0,
        mqSalamanca: results[0]?.MqSalamanca || 0,
        montalban: results[0]?.Montalban || 0,
        recuerdo: results[0]?.NtrRecuerdo || 0,
        orense: results[0]?.Orense || 0,
        plzEspaña: results[0]?.PlzEspaña || 0,
        plzMayor: results[0]?.PlzMayor || 0,
        recoletos: results[0]?.Recoletos || 0,
        sanEpifanio: results[0]?.SanEpifanio || 0,
        pedroZerolo: results[0]?.PedroZerolo || 0,
        villaParis: results[0]?.VillaParis || 0,
        olavide: results[0]?.Olavide || 0,
        metropolitano: results[0]?.Metropolitano || 0,
        fuenteMora: results[0]?.FuenteMora || 0,
      };

      return { status: 200, incidents: incidentsSummary }
    }catch (error) {
      console.error('Database error getAllIncParkingRange:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias totales por horas del dia, rango de fechas
  static async getAllIncByHours(startDate, endDate) {
    try {
      const [results] = await pool.query(QUERIES.allIncHours, [startDate, endDate]);
      return { status: 200, incidents: results }
    } catch (error) {
      console.error('Database error getAllIncByHours:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  // incidencias totales por dias, rango de fechas
  static async getAllIncByWeekdays(startDate, endDate) {
    try {
      const [results] = await pool.query(QUERIES.allIncWeekDay, [startDate, endDate]);
      return { status: 200, incidents: results }
    } catch(error) {
      console.error('Database error getAllIncByWeekdays:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

}
