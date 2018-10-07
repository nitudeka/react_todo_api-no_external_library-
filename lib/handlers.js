// Node dependencies
const fs = require('fs');
const _data = require('./data');
const helpers = require('./helpers');

// Handlers container
const handlers = {};

// Register handler
// Required data: name, email, password
handlers.register = (data, callback) => {
	// Check if the requested method is post
	if (data.method == 'post') {
		// Check if the sent fields are valid
		const name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
		const email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email : false;
		const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;

		if (name && email && password) {
			// Hash the given password, don't continue if it was unsuccessful
			const hashedPassword = helpers.hashString(password);
			if (hashedPassword) {
				// User data which have to get writen to the disk
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
	// Check if the requested method is post
	if (data.method == 'post') {
		// Check if the passed fields are valid, continue only if they are valid
		const email = typeof(data.payload.email) == 'string' && data.payload.email.length > 0 ? data.payload.email : false;
		const password = typeof(data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password : false;

		if (email && password) {
			// Read and send the user data to client
			_data.read('users', email, (err, userData) => {
				if (!err && userData) {
					// Hash the password to check if it is same as in the user object
					const hashedPassword = helpers.hashString(password);
					if (userData.userPassword == hashedPassword) {
						// Remove the password before sending it to the client
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
