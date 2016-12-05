const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const email = require('../email');

function newUser(data, res) {
	return new Promise(resolve => {
		console.log(`entered api`);
		//router.post('/', (req, res) => {
		let user = new User({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			username: data.username,
			password: bcrypt.hashSync(data.password, 10)
		});
		console.log(`saving user`);

		user.save((err, result) => {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred when creating user',
					error: err
				});
			}
			res.status(201).json({
				message: 'User created successfully',
				obj: result
			});
		});
		console.log(`user saved`);

		genToken(user)
			.then(token => {
				email.sendConfirmation(user.email, user.firstName, token);
			})
			.catch(console.log.bind(console));
		console.log(`shit should be done`);
		resolve();
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

function verifyEmail(req, res) {
	verifyToken(req.query.verification)
		.then( decoded => {

			//TODO use the following structure to resolve the db promise
			/*			return new Promise((resolve, reject) => {
			 Movie
			 .find({})
			 .sort({yify_id: 'descending'})
			 .limit(20)
			 .skip((page - 1) * 20)

			 look at this exec business
			 return err if db broke
			 .exec((err, bagOMovies) => {
			 if (err) {
			 return reject(err);
			 }
			 resolve(bagOMovies);
			 });
			 });*/


			User.update({username: decoded.user.username}, {$set: {verified: 1}}, (err) => {
				if (err) {
					return res.status(500).json({
						title: 'User not validated',
						error: err
					});
				}
			});
			console.log(`User verified`);
		})
		.catch(error => res.status(500).json(error));
}


function validatePass(user, hash) {
    return new Promise(resolve => {
        User.findOne()
    })
}

//TODO remove genToken export when done migrating from routes
module.exports = {
	newUser: newUser,
	getUser: getUser,
	genToken: genToken,
	verifyEmail: verifyEmail,
};