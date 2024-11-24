import { pool } from '../../db/mysql.js'
import QUERIES from './sqlQueries.js'

export default class UsersService {
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
            hour: avgInc[0]?.horas || 0,
            minute: avgInc[1]?.minutos || 0,
          },
        },
        lastYear: {
          open: openIncLastYear[0]?.count || 0,
          close: closeIncLastYear[0]?.count || 0,
          pending: pendingIncLastYear[0]?.count || 0,
          avg: {
            hour: avgIncLastYear[0]?.horas || 0,
            minute: avgIncLastYear[1]?.minutos || 0,
          },
        },
      }

      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error getIncidentsRange:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

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

  static async getOpenIncidentsGroup() {
    try {
      const [rows] = await pool.query(QUERIES.openIncidentsGroup)
      return { status: 200, incidents: rows }
    } catch (error) {
      console.error('Database error getIncidentsGroup:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }
}
