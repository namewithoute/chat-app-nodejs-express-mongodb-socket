const registerController = require('../controllers/register.controller')

const router = require('express').Router()

router.post('/', registerController)

module.exports = router