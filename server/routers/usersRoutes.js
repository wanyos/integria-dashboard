import express from 'express'

import usersController from ''

const usersRouter = express.Router()

const { getUsersController } = usersController()

usersRouter.get('/', getUsersController)

export default usersRouter
