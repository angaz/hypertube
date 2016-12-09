'use strict';

function sendConfirmation(email, name, token) {
	const SENDGRID_REGISTRATION_TEMPLATE = 'd75099cd-9a9e-4496-a6ba-ecf9797fe054';
	const SENDGRID_API_KEY = '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';
	const HOST = 'http://localhost:4200';
	const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
	let sg = require('sendgrid')(SENDGRID_API_KEY);

	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: {
			personalizations: [
				{
					to: [
						{
							'email': email,
						},
					],
					'substitutions': {
						'-name-': name,
						'-activation_code-': HOST + '/users/confirm?verification=' + token
					},
					subject: 'Welcome to Tubular, ' + name,
				},
			],
			from: {
				email: 'info@tubular.com',
			},
			content: [
				{
					type: 'text/html',
					value: '<p></p>',
				},
			],
			'template_id': SENDGRID_REGISTRATION_TEMPLATE,
		},
	});

	sg.API(request)
		.then(response => {
			console.log(`Email response code: ${response.statusCode}`);
			console.log(response.body);
			console.log(response.headers);
		})
		.catch(error => {
			console.log(error.response.statusCode);
		});
}

function sendReset(email, name, token) {
	const SENDGRID_REGISTRATION_TEMPLATE = 'a8a1c62e-5c5c-4574-b3e4-38ccc30401ad';
	const SENDGRID_API_KEY = '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';
	const HOST = 'http://localhost:4200';
	const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
	let sg = require('sendgrid')(SENDGRID_API_KEY);

	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: {
			personalizations: [
				{
					to: [
						{
							'email': email,
						},
					],
					'substitutions': {
						'-name-': name,
						'-password-reset-link-': HOST + '/users/reset/request?token=' + token
					},
					subject: 'Tubular password reset, ' + name,
				},
			],
			from: {
				email: 'info@tubular.com',
			},
			content: [
				{
					type: 'text/html',
					value: '<p></p>',
				},
			],
			'template_id': SENDGRID_REGISTRATION_TEMPLATE,
		},
	});

	sg.API(request)
		.then(response => {
			console.log(`Email response code: ${response.statusCode}`);
			console.log(response.body);
			console.log(response.headers);
		})
		.catch(error => {
			console.log(error.response.statusCode);
		});
}

module.exports = {
	sendConfirmation: sendConfirmation,
	sendReset: sendReset
};