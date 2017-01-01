"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

let schema = new Schema({
	local : {
/*		firstName: {type: String, required: true},
		lastName: String,
		email: {type: String, required: true, unique: true},
		username: {type: String, required: true, unique: true},
		password: {type: String, required: true},
		meta: Schema.Types.Mixed,
		verified: Boolean*/
		firstName: String,
		lastName: String,
		email: String,
		username: String,
		password: String,
		meta: String,
		verified: Boolean
	},
	facebook : {
		id           : String,
		token        : String,
		email        : String,
		name         : String
	},
	google : {
		id           : String,
		token        : String,
		email        : String,
		name         : String
	},
	fortytwo : {
		id           : String,
		token        : String,
		email        : String,
		name         : String
	}
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);