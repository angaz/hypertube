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
		console.log(`test ${req.body}`);
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

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.post('/users/facebook', (req, res) => {

});

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.post('/users/facebook/callback', (req, res) => {
	//passport.authenticate('facebook', { successRedirect: '/',
	//	failureRedirect: '/login' }));
});

//TODO Reroute to login when validated
router.get('/users/confirm/:verification?', (req, res) => {
	userApi.verifyEmail(req.query.verification)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});

//TODO Resend verification email
router.post('/users/resend', (req, res, next) => {

});


//TODO Reroute to /users/reset if request is invalid
router.get('/users/reset/request', (req, res) => {
	if (!req.query.token)
		return res.status(400).json('Invalid reset request');
	userApi.resetReqTest(req.query.token)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});


router.post('/users/reset', (req, res) => {
	if (req.body.username === undefined)
		return res.status(400).json('Invalid email');
	userApi.resetPass(req.body.email)
		.then(result => {
			//res.json(result);
			//res.render('/testsss', { title: 'Express' });
		})
		.catch(error => res.status(500).json(error));
});


module.exports = router;