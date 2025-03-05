import IncidentsService from '../../services/incidents/incidentsService.js'
import IssIncidentsService from '../../services/incidents/issIncidents.js'

export default class IncidentsController {
  static async getIncidents(req, res, next) {
    try {
      const { status, incidents } = await IncidentsService.getIncidents()
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getIssIncidents(req, res, next) {
    try {
      const { status, incidents } = await IssIncidentsService.getIssIncidents()
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

}
