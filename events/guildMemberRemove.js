const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const api = require('../utils/api');


module.exports = {
    name: 'guildMemberRemove',
    execute: async function(member) {
        logger.info(`User is leave or kicked at guild: ${member.guild.name} user:${member.user.id}`);

        const guildDb = await api.getGuild(channel.guild.id);

        if (guildDb) {
            if (guildDb.moderationMessages.enabled) {
                let moderatorChannel = channel.guild.channels.cache.find(channel => channel.name === guildDb.moderationMessages.channel);
                if (moderatorChannel) {
                    moderatorChannel.send(embed('Member Remove', [member]));
                }
            }
        }

        api.deleteMember(member.guild.id, member.user.id);
    }
};