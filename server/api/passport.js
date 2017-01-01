// const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const FortyTwoStrategy = require('passport-42').Strategy;

const User = require('./../models/user');
const configAuth = require('./../auth');

module.exports = (passport) => {

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
				done(err, user);
		});
	});
/*

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		(req, email, password, done) => {
		process.nextTick(() => {
			User.findOne({'local.username': email}, (err, user) => {
				if(err)
					return done(err);
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				}
				if(!req.user) {
					var newUser = new User();
					newUser.local.username = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save((err) => {
						if (err)
							throw err;
						return done(null, newUser);
					})
				}
				else {
					var user = req.user;
					user.local.username = email;
					user.local.password = user.generateHash(password);

					user.save((err) =>{
						if(err)
							throw err;
						return done(null, user);
					})
				}
			});
		});
		})
	);

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		(req, email, password, done) => {
			process.nextTick(() => {
				User.findOne({ 'local.username': email}, (err, user) => {
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No user found'));
					if(!user.validPassword(password)) {
						return done(null, false, req.flash('loginMessage', 'Invalid password'));
					}
					return done(null, user);
				})
			});
		})
	);
*/

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id','email', 'displayName' ],
		passReqToCallback: true
	},
		(req, accessToken, refreshToken, profile, done) => {
			process.nextTick(() => {
				//user is not logged in yet
				if(!req.user) {
					User.findOne({'facebook.id': profile.id}, (err, user) => {
						if(err)
							return done(err);
						if(user) {
							if (!user.facebook.token) {
								user.facebook.token = accessToken;
								user.facebook.name = profile.displayName;
								user.facebook.email = profile.emails[0].value;
								user.save((err) => {
									if (err)
										throw err;
								});
							}
							return done(null, user);
						}
						else {
							var newUser = new User();
							newUser.facebook.id = profile.id;
							newUser.facebook.token = accessToken;
							newUser.facebook.name = profile.displayName;
							newUser.facebook.email = profile.emails[0].value;
							newUser.save((err) => {
								if(err)
									throw err;
								return done(null, newUser);
							});
							console.log(profile);
						}
					});
				}
				//user is already logged in and needs to be merged
				else {
					var user = req.user;
					user.facebook.id = profile.id;
					user.facebook.token = accessToken;
					user.facebook.name = profile.displayName;
					user.facebook.email = profile.emails[0].value;

					user.save((err) => {
						if(err)
							throw err;
						return done(null, user);
					})
				}
			});
		})
	);

/*

	passport.use(new GoogleStrategy({
			clientID: configAuth.googleAuth.clientID,
			clientSecret: configAuth.googleAuth.clientSecret,
			callbackURL: configAuth.googleAuth.callbackURL,
			passReqToCallback: true
		},
		(req, accessToken, refreshToken, profile, done) => {
			process.nextTick(() => {
				//user is not logged in yet
				if(!req.user){
					User.findOne({'google.id': profile.id}, (err, user) => {
						if(err)
							return done(err);
						if(user) {
							if (!user.google.token) {
								user.google.token = accessToken;
								user.google.name = profile.displayName;
								user.google.email = profile.emails[0].value;
								user.save((err) => {
									if (err)
										throw err;
								});
							}
							return done(null, user);
						}
						else {
							var newUser = new User();
							newUser.google.id = profile.id;
							newUser.google.token = accessToken;
							newUser.google.name = profile.displayName;
							newUser.google.email = profile.emails[0].value;
							newUser.save((err) => {
								if(err)
									throw err;
								return done(null, newUser);
							});
							console.log(profile);
						}
					});
				}
				//user is already logged in and needs to be merged
				else{
					var user = req.user;
					user.google.id = profile.id;
					user.google.token = accessToken;
					user.google.name = profile.displayName;
					user.google.email = profile.emails[0].value;

					user.save((err) => {
						if(err)
							throw err;
						return done(null, user);
					})
				}
			});
		})
	);

	passport.use(new FortyTwoStrategy({
			clientID: configAuth.FortyTwoAuth.clientID,
			clientSecret: configAuth.FortyTwoAuth.clientSecret,
			callbackURL: configAuth.FortyTwoAuth.callbackURL,
			//profileFields: ['id','email', 'displayName' ],
			passReqToCallback: true
		},
		(req, accessToken, refreshToken, profile, done) => {
			process.nextTick(() => {
				//user is not logged in yet
				if(!req.user){
					User.findOne({'fortytwo': profile.id}, (err, user) => {
						if(err)
							return done(err);
						if(user) {
							if (!user.fortytwo.token) {
								user.fortytwo.token = accessToken;
								user.fortytwo.name = profile.displayName;
								user.fortytwo.email = profile.emails[0].value;
								user.save((err) => {
									if (err)
										throw err;
								});
							}
							return done(null, user);
						}
						else {
							var newUser = new User();
							newUser.fortytwo.id = profile.id;
							newUser.fortytwo.token = accessToken;
							newUser.fortytwo.name = profile.displayName;
							newUser.fortytwo.email = profile.emails[0].value;
							newUser.save((err) => {
								if(err)
									throw err;
								return done(null, newUser);
							});
							console.log(profile);
						}
					});
				}
				//user is already logged in and needs to be merged
				else{
					var user = req.user;
					user.fortytwo.id = profile.id;
					user.fortytwo.token = accessToken;
					user.fortytwo.name = profile.displayName;
					user.fortytwo.email = profile.emails[0].value;
					user.save((err) => {
						if(err)
							throw err;
						return done(null, user);
					})
				}

			});
		})
	);
*/

};