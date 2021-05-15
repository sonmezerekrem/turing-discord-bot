require('dotenv').config({ path: 'dev.env' });
const run = require('./app');

const client = run(__dirname);

client.login(process.env.token).catch(error => logger.error(error.message));