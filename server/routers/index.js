const Router = require('express')
const router = new Router()

const UserRouter = require('./userRouter')
router.use('/user', UserRouter)

const TaskRouter = require('./taskRouter')
router.use('/task', TaskRouter)

module.exports = router