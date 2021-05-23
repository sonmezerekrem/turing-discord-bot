const logger = require('../utils/logger');
const embed = require('../utils/embeds').helloOnJoin;
const api = require('../utils/api');

module.exports = {
    name: 'guildCreate',
    execute: async function(guild) {
        logger.info(`${guild.client.user.tag} is joined to ${guild.name} guildId:${guild.id}`);

        let channel = guild.channels.cache.find(channel => channel.name === 'general');
        if (channel == null) {
            channel = guild.channels.cache
                .filter(c => c.type === 'text'
                    && c.permissionsFor(guild.client.user).has('SEND_MESSAGES')
                    && c.permissionsFor(guild.roles.everyone))
                .first();
        }

        if (channel) {
            channel.send(embed(guild));
        }

        await api.saveGuild([guild.id, guild.ownerID, guild.createdAt, guild.joinedAt, guild.region]);
    }
};