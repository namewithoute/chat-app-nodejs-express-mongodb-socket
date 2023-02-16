const {optionsGET,optionPOST} = require('../controllers/options.controller')
const router= require('express').Router()

router.get('/',optionsGET)
module.exports=router