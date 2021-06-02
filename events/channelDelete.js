const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const api = require('../utils/api');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        if (channel.type !== 'dm') {
            logger.info(`Channel is deleted at guild: ${channel.guild.name} channel:${channel.id}`);

            const guildDb = await api.getGuild(channel.guild.id);

            if (guildDb) {
                if (guildDb.moderationMessages.enabled) {
                    const moderatorChannel = channel.guild.channels.cache
                        .find((chn) => chn.name === guildDb.moderationMessages.channel);
                    if (moderatorChannel) {
                        moderatorChannel.send(embed('Channel Delete', [channel, channel.guild.name, channel.guild.iconURL()]));
                    }
                }
            }
        }
    }
};
