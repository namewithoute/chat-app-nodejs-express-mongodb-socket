function optionsGET(req,res){
    res.render('option',{
        error: req.flash('error'),
    })
}

module.exports={
    optionsGET
}