const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = (dir, file, data, callback) => {
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fd) => {
		if (!err && fd) {
			const stringData = JSON.stringify(data)
			fs.writeFile(fd, stringData, (err) => {
				if (!err) {
					fs.close(fd, (err) => {
						if (!err) {
							callback(false);
						} else {
							callback(400, {Error: 'Cound not close the file'});
						}
					})
				} else {
					callback(400, {Error: 'Error writing to file'});
				}
			})
		} else {
			callback(400, {Error: 'Can not create the file, it may already exists'});
		}
	})
}

lib.read = (dir, file, callback) => {
	fs.readFile(lib.baseDir + dir + '/' + file + '.json', (err, data) => {
		if (!err && data) {
			const parsedData = helpers.parseJsonToObject(data);
			callback(false, parsedData);
		} else {
			callback(err, data);
		}
	})
}

module.exports = lib;
