import { pool } from '../../db/mysql.js'

const allIncidents = 'select * from tincidencia limit 100'

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
}
