const { connect } = require('./commons');
const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    execute: async function(client) {
        await connect(client);
        logger.info(`${client.user.tag} has started and it is ready now.`);
    }
};