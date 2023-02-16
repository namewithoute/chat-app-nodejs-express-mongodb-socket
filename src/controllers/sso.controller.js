const User=require('../models/user.model')



module.exports=function(req,res){
    var user= req.user
    console.log(user)
    User.findOneAndUpdate({username:user.id},{socialId:true,org:user._json.hd},{upsert:true},function(err,updated){
        return res.redirect('/options')
    })
}