"use strict";
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');

router.post('/', (req, res, next) => {
	let user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 10)
	});
	console.log(user);
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
