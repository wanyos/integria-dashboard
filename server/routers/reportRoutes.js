import express from 'express'

import ReportController from '../controllers/report/reportController.js'

const reportRouter = express.Router()

reportRouter.get('/range/:startDate/:endDate', ReportController.getIncidentsRange)
reportRouter.get('/group/:startDate/:endDate', ReportController.getAllIncidentsGroup)
reportRouter.get('/location/:startDate/:endDate', ReportController.getAllIncLocationRange)
reportRouter.get('/bases/:startDate/:endDate', ReportController.getAllIncBasesRange)
reportRouter.get('/year/:currentYear', ReportController.getAllIncidentsYear)
reportRouter.get('/open', ReportController.getOpenIncidentsGroup)
reportRouter.get('/byhours/:startDate/:endDate', ReportController.getAllIncByHours)

export default reportRouter
