const path = require('path')
const express = require('express')
const passport = require('../src/auth/index')
// const { generatemsg, generateLocation } = require('./utils/messages')

// const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')

const session = require('express-session')
var flash = require('connect-flash');
var cors = require('cors')

const app = express()
const router = require('./routes/index.route')
// const server = http.createServer(app)
// const io = socketio(server)
const ioServer = require('./socket/index')(app)
const PORT = process.env.PORT || 3000
require('dotenv').config()
const mongoose = require('./config/connectDB')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.use(cors({
    origin:`${process.env.DOMAIN}`
}))

const publicdir = path.join(__dirname, '../public')

app.use(express.static(publicdir))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    unset: 'destroy',
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(router)



ioServer.listen(PORT, () => {
    console.log("listen at port " + PORT)
})