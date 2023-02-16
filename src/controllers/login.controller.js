function loginGet(req,res,next){
    res.render('index', {
        success: req.flash('success')[0],
        errors: req.flash('error'),
        showRegisterForm: req.flash('showRegisterForm')[0]
    })
}

module.exports={loginGet}