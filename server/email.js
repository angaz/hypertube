'use strict';

let sendMail = (email, name, token) => {
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
						'-activation_code-': HOST + '/activate/?email=' + email + '&activation=' + token
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
	sg.API(request, function (error, response) {
		if (error) {
			console.log('Error response received');
		}
		console.log(response.statusCode);
		console.log(response.body);
		console.log(response.headers);
	});
};

module.exports = sendMail;