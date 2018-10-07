// Node dependencies
const fs = require('fs');
const _data = require('./data');
const helpers = require('./helpers');

// Handlers container
const handlers = {};

// Register handler
// Required data: name, email, password
handlers.register = (data, callback) => {
	if (data.method == 'post') {
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
	} else {
		callback(405, {Error: 'Method not allowed'});
	}
}

// Login handler
// Required data: email, password
handlers.login = (data, callback) => {
	if (data.method == 'post') {
		const email = typeof(data.payload.email) == 'string' && data.payload.email.length > 0 ? data.payload.email : false;
		const password = typeof(data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password : false;

		if (email && password) {
			_data.read('users', email, (err, userData) => {
				if (!err && userData) {
					const hashedPassword = helpers.hashString(password);
					if (userData.userPassword == hashedPassword) {
						delete userData.userPassword;
						callback(200, userData);
					} else {
						callback(400, {Error: 'Wrong credentials!'});
					}
				} else {
					callback(404, {Error: 'User does not exist'});
				}
			})
		} else {
			callback(400, {Error: 'Missing required fields'});
		}
	} else {
		callback(405, {Error: 'Method not allowed'});
	}
}

// Not-found handler
handlers.notFound = (data, callback) => {
	callback(404);
}

module.exports = handlers;
