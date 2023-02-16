const router=require('express').Router()
const passport =require('passport')

const ssoController =require('../controllers/sso.controller')


router.get('/', passport.authenticate('google'))
router.get('/userinfo',passport.authenticate('google',{ failureRedirect: '/' }),ssoController)
module.exports=router