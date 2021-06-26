require('dotenv')
    .config({ path: 'prod.env' });
const logger = require('./src/utils/logger');
const run = require('./src/app');

const client = run(__dirname);

try {
    process.on('uncaughtException', (error) => logger.error(error.message));
    client.login(process.env.TOKEN)
        .catch((error) => logger.error(error.message));
}
catch (e) {
    logger.error(e.message);
}
