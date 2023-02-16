
var passport = require('passport');
const path=require('path')
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config({path:path.resolve(__dirname+'../.env')})
var User = require('../models/user.model');
/**
 * Encapsulates all code for authentication 
 * Either by using username and password, or by using social accounts
 *
 */
var init = function () {

	// Serialize and Deserialize user instances to and from the session.
	passport.serializeUser(function (user, done) {
		return done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({ username: id }, function (err, user) {
			if (user) {
				return done(err, user);
			}

			User.findById({ _id: id }, function (err, user) {
				done(err, user)
			})
		});
	});
	// Plug-in Local Strategy
	passport.use(new LocalStrategy(
		function (username, password, done) {
			User.findOne({ username: new RegExp(username, 'i'), socialId: false }, function (err, user) {
				if (err) { return done(err); }

				if (!user) {
					return done(null, false, { message: 'Incorrect username or password.' });
				}
				user.validatePassword(password, function (err, isMatch) {
					if (err) { return done(err); }
					if (!isMatch) {
						return done(null, false, { message: 'Incorrect username or password.' });
					}
					return done(null, user);
				});
			});
		}
	));
	passport.use(new GoogleStrategy({
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: `${process.env.DOMAIN}/auth/google/userinfo`,
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		]
	},
		function (accessToken, refreshToken, profile, cb) {
			profile.accessToken = accessToken
			return cb(null, profile);
		}
	));

	return passport;
}

module.exports = init();