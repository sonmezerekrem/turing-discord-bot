const connect = require('./utils');
const logger = require('../utils/logger');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await connect(client);
        logger.info(`${client.user.tag} has started and it is ready now.`);
    }
};
