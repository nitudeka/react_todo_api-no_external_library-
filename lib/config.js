// Dependencies

const environments = {};

// Staging environment
environments.staging = {
	port: process.env.PORT || 3000,
	envName: 'staging',
	hashingSecret: process.env.HASHING_SECRET || 'thisIsASecret'
}

// Production environment
environments.production = {
	port: process.env.PORT || 3001,
	envName: 'production',
	hashingSecret: process.env.HASHING_SECRET || 'thisIsASecret'
}

const passedEnv = typeof(environments[process.env.NODE_ENV]) !== 'undefined' && typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : false;
const environmentToExport = passedEnv ? environments[passedEnv] : environments.staging;

module.exports = environmentToExport;
