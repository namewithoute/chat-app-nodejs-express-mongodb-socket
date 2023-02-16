module.exports=function(req,res){
    console.log(req.user.id)
    
    return res.json({userID:req.user.id})
}