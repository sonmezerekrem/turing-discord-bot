const { connect } = require('./commons');
const logger = require('../utils/logger');

module.exports = {
    name: 'reconnecting',
    once: true,
    execute(client) {
        logger.info(`${client.user.tag} is reconnecting.`);
        connect(client);
        logger.info(`${client.user.tag} is reconnected.`);
    }
};