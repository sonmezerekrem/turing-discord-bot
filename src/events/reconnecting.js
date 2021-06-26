const connect = require('./utils');
const logger = require('../utils/logger');


module.exports = {
    name: 'reconnecting',
    once: true,
    async execute(client) {
        logger.info(`${client.user.tag} is reconnecting.`);
        await connect(client);
        logger.info(`${client.user.tag} is reconnected.`);
    }
};
