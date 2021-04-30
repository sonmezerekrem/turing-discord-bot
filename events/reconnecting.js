const { connect } = require('../utils/connecting');
const logger = require('../utils/logger');

module.exports = {
    name: 'reconnecting',
    once: true,
    execute(client) {
        logger.info(`${client.user.tag} is reconnecting.`, 0);
        connect(client);
        logger.info(`${client.user.tag} is reconnected.`, 0);
    }
};