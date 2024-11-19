import { pool } from '../../db/mysql.js'

const allIncidents = 'select * from tincidencia limit 100'
const totalIncidents = 'SELECT * FROM tincidencia WHERE inicio BETWEEN ? AND ?'

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
      const results = await pool.query(totalIncidents, [startDate, endDate]);
      console.log('results', results);
      return { status: 200, incidents: results };
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch incidents from the database');
    }
  }

}
