"use strict";
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//TODO remove User and replace with var to user.api

const User = require('./models/user');
const userApi = require('./api/user.api');


const email = require('./email');

router.post('/users/signup', (req, res) => {
	if (req.body.email === undefined)
		return res.status(400).json('Invalid information supplied');
	userApi.newUser(req.body)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});

router.post('/users/signin', (req, res) => {
	getUser({username: req.body.username});

});

/*

router.post('/users/signin', (req, res, next) => {
	//call getuser
	User.findOne({username: req.body.username}, (err, user) => {
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

router.post('/resend', (req, res, next) => {

});

router.get('/users/confirm', (req, res, next) => {
//todo promise
	userApi.verifyEmail(req, res);

	/*
	activateUser.getPage((req.params.page === undefined) ? 1 : parseInt(req.params.page))
		.then(bagOMovies => res.json(bagOMovies))
		.catch(error => res.status(500).json(error));*/
});

router.post('/users/reset', (req, res, next) => {
	User.findOne({email: req.body.email}, (err, ret) => {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred when sending reset email',
				error: err
			});
		}
		if (!ret) {
			return res.status(401).json({
				title: 'Email not found',
				error: {message: 'Invalid email specified'}
			});
		}
		let token = jwt.sign({user: ret.username}, 'secretllamaissecret', {expiresIn: 21600}); //Expires in 6 hours
		//TODO clean up
		/*
		console.log("Checking username: ");
		console.log(ret.username);
		User.update({username: ret.username}, {
			$set : { resetToken: token }}, (err) => {
			if(err) {
				return res.status(500).json({
					title: 'Reset token not saved',
					error: err
				});
			}
		*/
		email.sendReset(ret.email, ret.firstName, token)
			.then(result => res.json(result))
			.catch(error => res.status(500).json(error));
	});
});

router.get('/users/reset/request', (req, res, next) => {
	jwt.verify(req.query.reset, 'secretllamaissecret', (err, decoded) => {
		if(err) {
			return res.status(401).json({
				title: 'Not Authenticated',
				error: err
			});
		}
		console.log("oh shit");
		User.findOne({ name: decoded.user.username }, (err) => {
			if(err) {
				return res.status(500).json({
					title: 'Username not found',
					error: err
				});
			}
		});
		console.log(res);
		res.json()
	});
});

module.exports = router;