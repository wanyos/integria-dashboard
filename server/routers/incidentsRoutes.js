import express from 'express'

import IncidentsController from '../controllers/incidents/incidentsController.js'

const incidentsRouter = express.Router()

// incidentsRouter.get('/range/:startDate/:endDate', IncidentsController.getIncidentsRange)
// incidentsRouter.get('/group/:startDate/:endDate', IncidentsController.getAllIncidentsGroup)
// incidentsRouter.get('/location/:startDate/:endDate', IncidentsController.getAllIncLocationRange)
// incidentsRouter.get('/year/:currentYear', IncidentsController.getAllIncidentsYear)
// incidentsRouter.get('/open', IncidentsController.getOpenIncidentsGroup)
incidentsRouter.get('/', IncidentsController.getIncidents)

export default incidentsRouter
