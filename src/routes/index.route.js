const router=require('express').Router()
const loginRoute=require('./login.route')
const loginSSORoute=require('./loginSSO.route')
const registerRoute=require('./register.route')
const optionsRoute=require('./options.route')
const isAuthenticate=require('../middlewares/auth')
const chatRoute=require('../routes/chat.route')
const identifyController = require('../api/identify.controller')
router.use('/',loginRoute)
router.use('/register',registerRoute)
router.use('/options',isAuthenticate,optionsRoute)
router.use('/chat',isAuthenticate,chatRoute)
router.use('/auth/google', loginSSORoute);
router.get('/identify',isAuthenticate,identifyController)
module.exports=router