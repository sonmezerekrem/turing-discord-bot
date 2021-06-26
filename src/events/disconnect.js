const logger = require('../utils/logger');


module.exports = {
    name: 'disconnect',
    once: true,
    execute(client) {
        logger.info(`${client.user.tag} is disconnecting.`);
    }
};
