"use strict";

const express = require('express');
const router = express.Router();
const User = require('./user.js');

router.post('/', (req, res, next) => {
	let user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: bcrypt.hashSync(req.body.password, 10),
		email: req.body.email,
	})
	user.save((err, result) => {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		res.status(201).json({
			message: 'User created',
			obj: result
		});
	});
});

module.exports = router;
