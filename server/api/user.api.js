"use strict";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const email = require('../email');

function newUser(data) {
	return new Promise(resolve => {
		let user = new User({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			username: data.username,
			password: bcrypt.hashSync(data.password, 10)
		});
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
						return reject(err);
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
		    	return reject(err);
		    }
	    	resolve(token);
	    });
    });
}

function verifyToken(code) {
	return new Promise((resolve, reject) => {
		jwt.verify(code, 'secretllamaissecret', (err, decoded) => {
			if (err) {
				return reject(err);
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
						return reject(err);
					}
					resolve(`User has been validated`);
				});
			})
			.catch(error => reject(error));
	});
}

module.exports = {
	newUser: newUser,
	getUser: getUser,
	userLogin: userLogin,
	genToken: genToken,
	verifyEmail: verifyEmail,
};