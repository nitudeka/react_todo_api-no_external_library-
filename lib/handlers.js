const fs = require('fs');
const _data = require('./data');
const helpers = require('./helpers');

const handlers = {};

handlers.users = (data, callback) => {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405, {Error: 'Method not allowed'});
	}
}

handlers._users = {};

handlers._users.post = (data, callback) => {
	const name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
	const email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email : false;
	const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;

	if (name && email && password) {
		const hashedPassword = helpers.hashString(password);
		if (hashedPassword) {
			const userObject = {
				userName: name,
				userEmail: email,
				userPassword: hashedPassword,
				joined: Date(Date.now())
			}

			_data.create('users', email, userObject, (err) => {
				if (!err) {
					callback(200);
				} else {
					callback(400, {Error: 'cound not create the user'})
				}
			})
		} else {
			callback(500, {Error: 'Unable to hash the password'});
		}
	} else {
		callback(400, {Error: 'Missing required fields'});
	}
}

handlers._users.get = (data, callback) => {
	const email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.length > 0 ? data.queryStringObject.email : false;
	if (email) {
		_data.read('users', email, (err, userData) => {
			if (!err && userData) {
				delete userData.userPassword;
				callback(200, userData);
			} else {
				callback(404, {Error: 'User does not exist'});
			}
		})
	} else {
		callback(400, {Error: 'Missing required fields'});
	}
}

handlers.notFound = (data, callback) => {
	callback(404);
}

module.exports = handlers;
