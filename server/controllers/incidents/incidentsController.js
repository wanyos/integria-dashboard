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

  static async getIncidentsRange(req, res, next) {
    const { startDate, endDate } = req.params
    if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      const error = new Error('startDate and endDate must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getIncidentsRange(startDate, endDate)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getAllIncidentsYear(req, res, next) {
    const { currentYear } = req.params
    if (!currentYear || isNaN(currentYear) || currentYear.length !== 4) {
      const error = new Error('currentYear must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getIncidentsYear(currentYear)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}
