"use strict";
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//TODO remove User and replace with user.api
const User = require('./models/user');
const userApi = require('./api/user.api');

router.post('/users/signup', (req, res) => {
	if (req.body.email === undefined)
		return res.status(400).json('Invalid registration information');
	userApi.newUser(req.body)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});

router.post('/users/signin', (req, res) => {
	if (req.body.username === undefined)
		return res.status(400).json('Invalid login information');
	userApi.userLogin(req.body)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});

//TODO Reroute to login when validated
router.get('/users/confirm/:verification?', (req, res) => {
	userApi.verifyEmail(req.query.verification)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});

//TODO Resend verification email
router.post('/resend', (req, res, next) => {

});

/*
//TODO Reset password function
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

		 email.sendReset(ret.email, ret.firstName, token)
		 .then(result => res.json(result))
		 .catch(error => res.status(500).json(error));
		 });
		 });


		router.get('/users/reset/request', (req, res, next) => {
			jwt.verify(req.query.reset, 'secretllamaissecret', (err, decoded) => {
				if (err) {
					return res.status(401).json({
						title: 'Not Authenticated',
						error: err
					});
				}
				User.findOne({name: decoded.user.username}, (err) => {
					if (err) {
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
	});
*/

module.exports = router;
