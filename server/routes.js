"use strict";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./user.model');

router.post('/user', (req, res, next) => {
	let user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 10),
		email: req.body.email,
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

module.exports = router;
