"use strict";
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const email = require('./email');

router.post('/', (req, res, next) => {
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
	console.log('Sending email');
	let token = jwt.sign({user: user}, 'secretllamaissecret', {expiresIn: 21600}); //Expires in 6 hours
	email.sendConfirmation(user.email, user.firstName, token)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
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
		User.findOne({ name: decoded.user.username }, function (err, doc){
			if(err) {
				return res.status(500).json({
					title: 'Username not found',
					error: err
				});
			}
			User.update({username: decoded.user.username},
				{ $set : { validated: 1 }}, (err, doc) =>	{
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
		let token = jwt.sign({user: user}, 'secretllamaissecret', {expiresIn: 21600}); //Expires in 6 hours
		res.status(200).json({
			message: 'Successfully logged in',
			token: token,
			userId: user._id
		});
	});
});

module.exports = router;