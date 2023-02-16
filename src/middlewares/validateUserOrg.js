const ROOM_TYPE=['stranger','schoolmate']

module.exports = function (req, res, next) {
    if(!ROOM_TYPE.includes(req.query.type)){
        return next(new Error('invalid room type'))
    }    
    if (req.query.type == 'schoolmate') {
        if (!req.user.socialId && !req.user.org) {
            req.flash("error", "Please use your school email to talk with your schoolmate");
            console.log('catch')
            return res.redirect('/options')
        }
    }

    next()
}