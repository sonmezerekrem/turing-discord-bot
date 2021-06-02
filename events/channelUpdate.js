const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const api = require('../utils/api');

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel) {
        if (newChannel.type !== 'dm') {
            logger.info(`Channel is updated at guild: ${newChannel.guild.name} channel:${newChannel.id}`);

            const guildDb = await api.getGuild(oldChannel.guild.id);

            if (guildDb) {
                if (guildDb.moderationMessages.enabled) {
                    const moderatorChannel = oldChannel.guild.channels.cache
                        .find((channel) => channel.name === guildDb.moderationMessages.channel);
                    if (moderatorChannel) {
                        moderatorChannel.send(embed('Channel Update', [oldChannel, newChannel, newChannel.guild.name, newChannel.guild.iconURL()]));
                    }
                }
            }
        }
    }
};
