"use strict";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const email = require('../email');

function newUser(data) {
	return new Promise(resolve, reject => {
		let user = new User({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			username: data.username,
			password: bcrypt.hashSync(data.password, 10),
			verified: 0
		});
		getUser({username: user.username})
			.then(result => {
				if (result !== null) {
					return reject({
						title: 'User creation failed',
						error: {message: 'User already exists!'}
					});
				}
			})
			.catch(console.log.bind(console));
		getUser({email: user.email})
			.then(result => {
				if (result !== null) {
					return reject({
						title: 'User creation failed',
						error: {message: 'Email already exists!'}
					});
				}
			})
			.catch(console.log.bind(console));
		saveUser(user)
			.catch(console.log.bind(console));
		genToken(user)
			.then(token => {
				email.sendConfirmation(user.email, user.firstName, token);
			})
			.catch(console.log.bind(console));
		resolve(`User registered successfully`);
	});
}

function resetPass(userEmail) {
	return new Promise((resolve, reject) => {
		getUser({email: userEmail})
			.then(result => {
				if (result === null) {
					return reject({
						title: 'User creation failed',
						error: {message: 'Email already exists!'}
					});
				}
				genToken(result)
					.then(token => {
						email.sendReset(result.email, result.firstName, token);
					})
					.catch(console.log.bind(console));
			})
			.catch(console.log.bind(console));
		resolve(`Reset request sent successfully`);
	});
}

function resetReqTest(token) {
	return new Promise((resolve, reject) => {
		verifyToken(token)
			.then(decoded => {
				getUser({email: decoded.user.email})
					.then(result => {
						if (result === null) {
							return reject({
								title: 'Reset request failed',
								error: {message: 'Illegal token!'}
							});
						}
					})
					.catch(console.log.bind(console));
			})
			.catch(console.log.bind(console));
		resolve(`shit worked`);
	});
}

function saveUser(user) {
	return new Promise(resolve => {
		user
			.save(user)
			.catch(console.log.bind(console));
		resolve(user);
	});
}

function userLogin(user) {
	return new Promise((resolve, reject) => {
		getUser({username: user.username})
			.then(result => {
				bcrypt.compare(user.password, result.password, (err, res) => {
					if (err || !res) {
						return reject({
							message: 'Passwords don\'t match!',
							error: error
						});
					}
					genToken(user)
						.then(token => resolve({
							token: token, userId: result._id
						}))
						.catch(error => {
							reject(error)
						})
				})
			})
	});
}

function getUser(query) {
    return new Promise(resolve => {
        User
            .findOne(query)
            .exec((err, user) => {
                if (err) {
                    throw new Error(err);
                }
                resolve(user);
            });
    });
}

function genToken(user) {
    return new Promise((resolve, reject) => {
	    jwt.sign({user: user}, 'secretllamaissecret', {expiresIn: 21600}, (err, token) => {
		    if (err) {
			    return reject({
				    message: 'Token generation failed!',
				    error: error
			    });
		    }
	    	resolve(token);
	    });
    });
}

function verifyToken(code) {
	return new Promise((resolve, reject) => {
		jwt.verify(code, 'secretllamaissecret', (err, decoded) => {
			if (err) {
				return reject({
					message: 'Invalid token!',
					error: error
				});
			}
			resolve(decoded);
		});
	});
}

function verifyEmail(verification) {
	return new Promise((resolve, reject) => {
		verifyToken(verification)
			.then( decoded => {
				User.update({username: decoded.user.username}, {$set: {verified: 1}}, (err) => {
					if (err) {
						return reject({
							message: 'User verification failed!',
							error: error
						});
					}
					resolve(`User has been verified`);
				});
			})
			.catch(error => reject(error));
	});
}

module.exports = {
	newUser: newUser,
	getUser: getUser,
	userLogin: userLogin,
	resetPass: resetPass,
	resetReqTest: resetReqTest,
	genToken: genToken,
	verifyEmail: verifyEmail,
};