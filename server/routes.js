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
router.post('/users/resend', (req, res, next) => {

});

router.post('/users/reset', (req, res) => {
	if (req.body.username === undefined)
		return res.status(400).json('Invalid email');
	userApi.resetPass(req.body.email)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});

//TODO Reroute to /users/reset if request is invalid
router.get('/users/reset/request', (req, res) => {
	if (!req.query.token) {
		return res.status(400).json('Invalid reset request');
	}
	userApi.resetReqTest(req.query.token)
		.then(result => res.json(result))
		.catch(error => res.status(500).json(error));
});




module.exports = router;
