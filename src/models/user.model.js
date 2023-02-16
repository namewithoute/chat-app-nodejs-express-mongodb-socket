const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
var mongoose 	= require('../config/connectDB');
var bcrypt      = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = process.env.SALT;


var UserSchema = new mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, default: null },
    socialId: { type: Boolean, default: false },
    org:{type:String, default:null}
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// Create a user model
var userModel = mongoose.model('user', UserSchema);

module.exports = userModel;