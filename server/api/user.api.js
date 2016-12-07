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
		let dbUser = getUser({username: user.username})
			.catch(error => reject(error));
		console.log(test);
		console.log(`hash? ${USE}`);
		let passMatch = bcrypt.compare(user.password, dbUser.password);
		console.log(`Passmatch? ${passMatch}`);

		resolve();
	});
//	});
	 /*
	   if (err) {
	 return res.status(500).json('Invalid information supplied');
	 return res.status(500).json({
	 title: 'An error occurred when logging in',
	 error: err
	 });
	 }
	 if (!user) {
	 return res.status(401).json({
	 title: 'Login failed',
	 error: {message: 'Invalid login credentials'}
	 });
	 }
	 //pwd verify

	 if (!bcrypt.compareSync(req.body.password, user.password)) {
	 return res.status(401).json({
	 title: 'Login failed',
	 error: {message: 'Invalid login credentials'}
	 });
	 }



	 //getToken
	 let token = user.genToken(req.body.username);
	 res.status(200).json({
	 message: 'Successfully logged in',
	 token: token,
	 userId: user._id
	 });
	 });
	 });
	 */


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

/*
function verifyPass(userHash, dbHash) {
	return new Promise((resolve, reject) => {
		bcrypt.compareSync(userHash, dbHash), (err, token) => {
			if (err) {
				return reject(err);
			}
			resolve(token);
		});
	});
	    if (!bcrypt.compareSync(userHash, dbHash)) {
		    return res.status(401).json({
			    title: 'Login failed',
			    error: {message: 'Invalid login credentials'}
		    });
	    }
    })
}

*/

//TODO remove genToken export when done migrating from routes
module.exports = {
	newUser: newUser,
	getUser: getUser,
	userLogin: userLogin,
	genToken: genToken,
	verifyEmail: verifyEmail,
};