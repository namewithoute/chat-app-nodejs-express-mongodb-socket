const User =require('../models/user.model')
const Room =require('../models/room.model')

module.exports=async function(req,res){
    
   
    res.render('chat',{username:req.user.username})
}