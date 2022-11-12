const Router = require('express')
const taskControllers = require('../controllers/taskControllers')
const router = new Router()


router.post('/get', taskControllers.getAll)
router.post('/getGroupByResponsible', taskControllers.getGroupByResponsible)
router.post('/getGroupByDate', taskControllers.getGroupByDate)
router.post('/getSort', taskControllers.getSort)
router.get('/get/:id', taskControllers.getOne)
router.post('/update', taskControllers.updateTask)
router.post('/create', taskControllers.createTask)

module.exports = router