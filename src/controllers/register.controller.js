const User = require('../models/user.model')
module.exports =  function (req,res,next) {
    if (req.body.username === '' || req.body.password === '') {
        req.flash('error', 'Missing credentials');
        req.flash('showRegisterForm', true);
        res.redirect('/');
    } else {

        // Check if the username already exists for non-social account
             User.findOne({ 'username': new RegExp('^' + req.body.username + '$', 'i'), 'socialId': false }, function (err, user) {
            if (err) throw err;
            if (user) {
                req.flash('error', 'Username already exists.');
                req.flash('showRegisterForm', true);
                res.redirect('/');
            } else {
                User.create({username:req.body.username,password:req.body.password}, function (err, newUser) {
                    if (err) throw err;
                    req.flash('success', 'Your account has been created. Please log in.');
                    res.redirect('/');
                });
            }
        });
    }
}