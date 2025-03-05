import { readExcelFile } from '../../email-config/conver_excel.js'

export default class IssIncidentsService {
  static async getIssIncidents() {
    try {
      // const path = './consulta_2024-2025.xlsx'
      // const iss_incidents = await readExcelFile('./consulta_2024-2025.xlsx')

      const iss_incidents = []

      console.log('incidnets', iss_incidents)
      return { status: 200, incidents: iss_incidents }
    } catch (error) {
      console.error('Database error:', error.message)
      throw new Error('Failed to fetch incidents from the database')
    }
  }
}
