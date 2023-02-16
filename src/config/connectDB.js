const mongoose = require('mongoose')
const path = require('path')
mongoose.set("strictQuery", false);

require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const DB_URL = process.env.URL_MONGO
mongoose.connect(DB_URL)

mongoose.connection.once('open',()=>{
    console.log('connect to mongo successfully')
})

mongoose.connection.on('error', function(err) {
	if(err) throw err;
});


module.exports=mongoose