"use strict";
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const email = require('./email');

router.post('/', (req, res) => {
	let user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 10)
	});
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
	let token = jwt.sign({user: user.username}, 'secretllamaissecret', {expiresIn: 21600}); //Expires in 6 hours
	email.sendConfirmation(user.email, user.firstName, token)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});

router.post('/signin', (req, res, next) => {
	User.findOne({username: req.body.username}, (err, user) => {
		if (err) {
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
		if (!bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(401).json({
				title: 'Login failed',
				error: {message: 'Invalid login credentials'}
			});
		}
		let token = jwt.sign({user: req.body.username}, 'secretllamaissecret', {expiresIn: 21600}); //Expires in 6 hours
		res.status(200).json({
			message: 'Successfully logged in',
			token: token,
			userId: user._id
		});
	});
});

router.post('/resend', (req, res, next) => {

});

router.get('/activate', (req, res, next) => {
	jwt.verify(req.query.activation, 'secretllamaissecret', (err, decoded) => {
		if (err) {
			return res.status(401).json({
				title: 'Not Authenticated',
				error: err
			});
		}
		User.findOne({ name: decoded.user.username }, (err) => {
			if(err) {
				return res.status(500).json({
					title: 'Username not found',
					error: err
				});
			}
			User.update({username: decoded.user.username},
				{ $set : { validated: 1 }}, (err) =>	{
				if(err) {
					return res.status(500).json({
						title: 'Email not validated',
						error: err
					});
				}
			});
		});
	});
});

router.post('/reset', (req, res, next) => {
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

router.get('/reset/request', (req, res, next) => {
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
