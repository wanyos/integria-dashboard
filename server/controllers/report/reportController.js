import IncidentsService from '../../services/incidents/incidentsService.js'

export default class ReportController {
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

  static async getTotalIncYears(req, res, next) {
    const { lastYear } = req.params
    if (!lastYear || isNaN(lastYear) || lastYear.length !== 4) {
      const error = new Error('currentYear must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getTotalIncYears(lastYear)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getOpenIncidentsGroup(req, res, next) {
    try {
      const { status, incidents } = await IncidentsService.getOpenIncidentsGroup()
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getAllIncidentsGroup(req, res, next) {
    const { startDate, endDate } = req.params
    if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      const error = new Error('startDate and endDate must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getAllIncidentsGroup(startDate, endDate)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getAllIncLocationRange(req, res, next) {
    const { startDate, endDate } = req.params
    if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      const error = new Error('startDate and endDate must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getAllIncLocationRange(
        startDate,
        endDate,
      )
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getAllIncBasesRange(req, res, next) {
    const { startDate, endDate } = req.params
    if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      const error = new Error('startDate and endDate must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getAllIncBasesRange(startDate, endDate)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getAllIncParkingRange(req, res, next) {
    const { startDate, endDate } = req.params
    if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      const error = new Error('startDate and endDate must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getAllIncParkingRange(startDate, endDate)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getAllIncByHours(req, res, next) {
    const { startDate, endDate } = req.params
    if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      const error = new Error('startDate and endDate must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getAllIncByHours(startDate, endDate)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getAllIncByWeekdays(req, res, next) {
    const { startDate, endDate } = req.params
    if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      const error = new Error('startDate and endDate must be valid date values')
      error.status = 400
      return next(error)
    }
    try {
      const { status, incidents } = await IncidentsService.getAllIncByWeekdays(startDate, endDate)
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getAllIncByMonths(req, res, next) {
    try {
      const { status, incidents } = await IncidentsService.getAllIncByMonths()
      return res.status(status).json(incidents)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}
