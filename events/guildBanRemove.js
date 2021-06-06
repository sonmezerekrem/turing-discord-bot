const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const api = require('../utils/api');


module.exports = {
    name: 'guildBanRemove',
    async execute(guild, user) {
        logger.info(`User ban is removed at guild: ${guild.name} user:${user.id}`);

        const guildDb = await api.getGuild(guild.id);

        if (guildDb) {
            if (guildDb.moderationMessages.enabled) {
                const moderatorChannel = guild.channels.cache
                    .find((channel) => channel.name === guildDb.moderationMessages.channel);
                if (moderatorChannel) {
                    moderatorChannel.send(embed('Ban Remove', [user]));
                }
            }
        }
    }
};
