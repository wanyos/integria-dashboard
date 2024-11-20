import { pool } from '../../db/mysql.js'

const allIncidents = 'select * from tincidencia limit 100'
const totalIncidents = 'SELECT * FROM tincidencia WHERE inicio BETWEEN ? AND ?'

const openIncidents = 'SELECT COUNT(*) AS count FROM tincidencia WHERE inicio BETWEEN ? AND ?'
const closeIncidents =
  'SELECT COUNT(*) AS count FROM tincidencia WHERE inicio BETWEEN ? AND ? AND cierre > "0001-01-01"'
const pendingIncidents =
  'SELECT COUNT(*) AS count FROM tincidencia WHERE inicio BETWEEN ? AND ? AND cierre < "0001-01-01"'

// select count(*) from tincidencia where inicio between '2024-11-01' and '2024-11-11';
// SELECT count(*) from tincidencia WHERE inicio BETWEEN '2024-11-01' AND '2024-11-11' AND cierre > '0001-01-01';
// SELECT count(*) from tincidencia WHERE inicio BETWEEN '2024-11-01' AND '2024-11-11' AND cierre < '0001-01-01';

export default class UsersService {
  static async getIncidents() {
    try {
      const [rows] = await pool.query(allIncidents)
      return { status: 200, incidents: rows }
    } catch (error) {
      console.error(error)
      console.error('Database error:', error.message)
      throw new Error('Failed to fetch incidents from the database')
    }
  }

  static async getTotalIncidents(startDate, endDate) {
    try {
      const startDateLastYear = new Date(startDate)
      startDateLastYear.setFullYear(startDateLastYear.getFullYear() - 1)

      const endDateLastYear = new Date(endDate)
      endDateLastYear.setFullYear(endDateLastYear.getFullYear() - 1)

      const startLastYear = startDateLastYear.toISOString().split('T')[0]
      const endLastYear = endDateLastYear.toISOString().split('T')[0]

      const [openInc] = await pool.query(openIncidents, [startDate, endDate])
      const [closeInc] = await pool.query(closeIncidents, [startDate, endDate])
      const [pendingInc] = await pool.query(pendingIncidents, [startDate, endDate])

      const [openIncLastYear] = await pool.query(openIncidents, [startLastYear, endLastYear])
      const [closeIncLastYear] = await pool.query(closeIncidents, [startLastYear, endLastYear])
      const [pendingIncLastYear] = await pool.query(pendingIncidents, [startLastYear, endLastYear])

      const incidentsSummary = {
        current: {
          open: openInc[0]?.count || 0,
          close: closeInc[0]?.count || 0,
          pending: pendingInc[0]?.count || 0,
        },
        lastYear: {
          open: openIncLastYear[0]?.count || 0,
          close: closeIncLastYear[0]?.count || 0,
          pending: pendingIncLastYear[0]?.count || 0,
        },
      }

      return { status: 200, incidents: incidentsSummary }
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch incidents from the database')
    }
  }
}
