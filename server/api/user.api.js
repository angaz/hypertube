const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
/*

function genToken(username, res) {
	jwt.sign({user: username}, 'secretllamaissecret', {expiresIn: 21600}, callback => {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred when creating user',
				error: err
			});
		}
		token.status(201).json({
			message: 'User created successfully',
			obj: token
		});
	});
}
*/


function validatePass(user, hash) {
    return new Promise(resolve => {
        User.findOne()
    })
}
module.exports = {
    getUser: getUser,
    genToken: genToken
};