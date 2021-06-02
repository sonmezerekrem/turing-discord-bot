const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const api = require('../utils/api');

module.exports = {
    name: 'guildBanAdd',
    async execute(guild, user) {
        logger.info(`User is banned at guild: ${guild.name} user:${user.id}`);


        const guildDb = await api.getGuild(guild.id);

        if (guildDb) {
            if (guildDb.moderationMessages.enabled) {
                const moderatorChannel = guild.channels.cache
                    .find((channel) => channel.name === guildDb.moderationMessages.channel);
                if (moderatorChannel) {
                    const banInfo = await guild.fetchBan(user);
                    moderatorChannel.send(embed('Ban', [banInfo]));
                }
            }
        }
    }
};
