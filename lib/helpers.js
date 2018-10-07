// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Helpers container
const helpers = {};

// Parse JSON to object
helpers.parseJsonToObject = (str) => {
	try {
		const parsedData = JSON.parse(str);
		return parsedData;
	} catch (e) {
		return {}
	}
}

// Hash the given string
helpers.hashString = (str) => {
	str = typeof(str) == 'string' && str.length > 0 ? str : false;
	if (str) {
		const hashedString = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hashedString;
	} else {
		return false;
	}
}

module.exports = helpers;
