const logger = require('../utils/logger');

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        logger.info('Joined to a new guild', guild.id);
    }
};