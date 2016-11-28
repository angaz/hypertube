
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

function sendMail(user) {
	const helper = require('sendgrid').mail;
	const SENDGRID_REGISTRATION_TEMPLATE = 'd75099cd-9a9e-4496-a6ba-ecf9797fe054';
	const SENDGRID_API_KEY = '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';
	from_email = new helper.Email('info@tubular.com')
	to_email = new helper.Email(user.email);
	subject = 'Welcome to Tubular, ' + user.firstName;
	content = new helper.Content("text/html", '<p></p>');
	template = new helper.Template()
	mail = new helper.Mail(from_email, subject, to_email, content)
	substitutions = new helper.Substitution('-name-', user.firstName);
	mail.addPersonalization(substitution);
	substitutions = new helper.Substitution('-activation_link-', HOST + '/api/user/activate/?email=' + user.email + '&activation=' + 'code goes here');
	mail.addPersonalization(substitution);

/////////////////////////////////
	console.log("mail includes: ");
	console.log(mail);
/////////////////////////////////

	let sg = require('sendgrid')(SENDGRID_API_KEY);
	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		//'template_id': SENDGRID_REGISTRATION_TEMPLATE,
		body: mail.toJSON()
	});

	sg.API(request, function (error, response) {
		console.log(response.statusCode);
		console.log(response.body);
		console.log(response.headers);
	});

}
/*
const SENDGRID_REGISTRATION_TEMPLATE = 'd75099cd-9a9e-4496-a6ba-ecf9797fe054';
const SENDGRID_API_KEY = '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';
const HOST = 'http://localhost:4200';
const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
let sg = require('sendgrid')(SENDGRID_API_KEY);

function emailConfirm(user, next) {
	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: {
			personalizations: [
				{
					to: [
						{
							'email': user.email,
						},
					],
					'substitutions': {
						'-name-': user.firstName,
						'-activation_link-': HOST + '/api/user/activate/?email=' + user.email + '&activation=' + user.activationCode, //token
					},
					subject: 'Welcome to Tubular, ' + user.firstName,
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
}
*/