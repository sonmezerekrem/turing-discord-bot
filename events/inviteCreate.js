const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const api = require('../utils/api');

module.exports = {
    name: 'inviteCreate',
    execute: async function(invite) {

        try {
            const guild = invite.guild;
            const user = invite.inviter;
            logger.info(`New invite is created at guild: ${guild.name} user:${user.id}`);

            const guildDb = await api.getGuild(channel.guild.id);

            if (guildDb) {
                if (guildDb.moderationMessages.enabled) {
                    let moderatorChannel = channel.guild.channels.cache.find(channel => channel.name === guildDb.moderationMessages.channel);
                    if (moderatorChannel) {
                        moderatorChannel.send(embed('Invite Create', [user, invite.url, invite.expiresAt, guild.name]));
                    }
                }
            }
        }
        catch (e) {
            logger.error(e.message);
        }
    }
};