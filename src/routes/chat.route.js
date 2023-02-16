const chatController = require('../controllers/chat.controller')
const validateUserOrg = require('../middlewares/validateUserOrg')

const router =require('express').Router()

router.get('/',validateUserOrg, chatController)


module.exports=router