import IncidentsService from '../../services/incidents/incidentsService.js'

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

  static async getTotalIncidents(req, res, next) {
    // console.log('params', req);
    const { startDate, endDate } = req.params
    // console.log('date controller', startDate, endDate)
    if (!startDate || !endDate) {
      const error = new Error('startDate and endDate are required')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getTotalIncidents(startDate, endDate)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}
