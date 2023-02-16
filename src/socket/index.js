const http = require('http')
const { generateLocation, generatemsg } = require('../utils/messages')
const { addUser, removeUser, getUser, getUserInRoom } = require('../utils/users')
const Room = require('../models/room.model')
const User = require('../models/user.model')
const { default: mongoose } = require('mongoose')
function ioEvents(io) {
    io.on("connection", (socket) => {

        socket.on("join", async ({ userID, socketID, room }, cb) => {
            console.log('connected')
            // const { error, user } = addUser({ id: socket.id, username, room })

            // if (error) {
            //     return cb(error)
            // }
            var findValidRoom
            // findValidRoom = await Room.findOneAndUpdate({ connections: { $size: 1 }, 'option.typeBox': room }, { $push: { connections: { userID: mongoose.Types.ObjectId(userID), socketID: socketID } } }, { upsert: true, new: true }).populate('connections.userID')

            switch (room) {
                case 'stranger':
                    findValidRoom = await Room.findOneAndUpdate({ connections: { $size: 1 }, 'option.typeBox': room }, { $push: { connections: { userID: mongoose.Types.ObjectId(userID), socketID: socketID } } }, { upsert: true, new: true }).populate('connections.userID')
                    break;
                case 'schoolmate':
                    //check org of user
                    var getRoomOrg = await Room.findOne({ connections: { $size: 1 }, 'option.typeBox': room }).populate('connections.userID', 'org -_id')
                    var getUserOrg = await User.findById(userID)

                    if (getRoomOrg == null || (getRoomOrg.connections[0].userID.org != getUserOrg.org)) {
                        findValidRoom = await Room.create({ connections: [{ userID: mongoose.Types.ObjectId(userID), socketID: socketID }], option: { typeBox: 'schoolmate' } })
                    }
                    else {
                        findValidRoom = await Room.findOneAndUpdate({ _id: getRoomOrg.id }, { $push: { connections: { userID: mongoose.Types.ObjectId(userID), socketID: socketID } } }, { new: true })
                    }
                    break;
            }
            socket.emit("message", generatemsg("User", "Welcome"))
            socket.join(findValidRoom.id)

            if (findValidRoom.connections.length == 2) {
                io.in(findValidRoom.id).emit("message", generatemsg("Stranger has joined!"))
            }
            cb()
        })

        socket.on("sendMessage", async (msg, cb) => {
            // const user = getUser(socket.id)
            var findRoom = await Room.findOne({ 'connections.socketID': socket.id })
            socket.broadcast.to(findRoom.id).emit("message", generatemsg("Stranger", msg))
            cb()
        })

        socket.on("sendLocation", async (location, cb) => {
            // const user = getUser(socket.id)
            // console.log(user)
            console.log(location)
            var findRoom = await Room.findOne({ 'connections.socketID': socket.id })

            socket.broadcast.to(findRoom.id).emit("locationurl", generateLocation("Stranger's location", `https://www.google.com/maps?q=${location.latitude},${location.longitude}`))
            cb()
        })
        socket.on('leave', async () => {
            var findBySocketID = await Room.findOneAndUpdate({ 'connections.socketID': socket.id }, { $pull: { 'connections': { socketID: socket.id } } }, { upsert: false, new: true })
            if (findBySocketID && findBySocketID.connections.length == 0) {
                await Room.deleteOne({ _id: findBySocketID.id })
            }
            if (findBySocketID != null)
                socket.broadcast.to(findBySocketID.id).emit("message", generatemsg(`Stranger has left`))
        })

        socket.on("disconnect", async () => {
            var findBySocketID = await Room.findOneAndUpdate({ 'connections.socketID': socket.id }, { $pull: { 'connections': { socketID: socket.id } } }, { upsert: false, new: true })
            if (findBySocketID != null && findBySocketID.connections.length == 0) {
                await Room.deleteOne({ _id: findBySocketID.id })
                return
            }
            if (findBySocketID != null)
                io.to(findBySocketID.id).emit("message", generatemsg(`Stranger has left`))
        })
    })
}
function init(app) {
    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    ioEvents(io)
    return server
}
module.exports = init