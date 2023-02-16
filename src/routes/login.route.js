const { loginGet } = require('../controllers/login.controller')
const passport = require('passport')

const router = require('express').Router()

router.get('/', loginGet)
router.post('/login', passport.authenticate('local', {
	successRedirect: '/options',
	failureRedirect: '/',
	failureFlash: true
}))




module.exports = router