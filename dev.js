require('dotenv')
    .config({ path: 'dev.env' });
const logger = require('./utils/logger');
const run = require('./app');

const client = run(__dirname);

try {
    process.on('uncaughtException', (error) => logger.error(error.message));
    client.login(process.env.TOKEN)
        .catch((error) => logger.error(error.message));
}
catch (e) {
    logger.error(e.message);
}
