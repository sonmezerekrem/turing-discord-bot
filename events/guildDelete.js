const logger = require('../utils/logger');
const api = require('../utils/api');


module.exports = {
    name: 'guildDelete',
    execute: async function(guild) {
        logger.info(`${guild.client.user.tag} is deleted: ${guild.name} guildId:${guild.id}`);

        api.deleteGuild(guild.id);
    }
};