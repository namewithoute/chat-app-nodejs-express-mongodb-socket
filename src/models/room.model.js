
var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
    connections: [
        {
            userID: { type: mongoose.Types.ObjectId, ref: 'user' },
            socketID: { type: String, default: null }
        }],
    option: {
        typeBox: { type: String, required: true },
        distance: { type: Number, default: 6371 },
    }
});


var roomModel = mongoose.model('room', RoomSchema);

module.exports = roomModel;