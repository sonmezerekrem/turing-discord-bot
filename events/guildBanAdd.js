const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { turing } = require('../config.json');

module.exports = {
    name: 'guildBanAdd',
    execute: async function(guild, user) {
        logger.info(`User is banned at guild: ${guild.name} user:${user.id}`);


        const guildDb = await api.getGuild(channel.guild.id);

        if (guildDb) {
            if (guildDb.moderationMessages.enabled) {
                let moderatorChannel = channel.guild.channels.cache.find(channel => channel.name === guildDb.moderationMessages.channel);
                if (moderatorChannel) {
                    const banInfo = await guild.fetchBan(user)
                    moderatorChannel.send(embed('Ban', [banInfo]));
                }
            }
        }
    }
};