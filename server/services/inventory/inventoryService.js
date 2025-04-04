import { pool } from '../../db/mysql.js'
import { DatabaseError } from '../../util/errors.js'

const allInventory = 'select * from tinventory limit 100'

export default class InventoryService {
  static async getInventory() {
    try {
      const [rows] = await pool.query(allInventory)
      return { status: 200, inventory: rows }
    } catch (error) {
      console.error('Database error getInventory:', error.message)
      throw new DatabaseError('Failed to fetch inventory from the database')
    }
  }
}
