const logger = require('../utils/logger');

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        logger.info(`${guild.client.user.tag} is joined to ${guild.name} guildId:${guild.id}`);
    }
};