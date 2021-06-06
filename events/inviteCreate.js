const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const api = require('../utils/api');


module.exports = {
    name: 'inviteCreate',
    async execute(invite) {
        try {
            const {
                guild,
                channel
            } = invite;
            const user = invite.inviter;
            logger.info(`New invite is created at guild: ${guild.name} user:${user.id}`);

            const guildDb = await api.getGuild(channel.guild.id);

            if (guildDb) {
                if (guildDb.moderationMessages.enabled) {
                    const moderatorChannel = channel.guild.channels.cache
                        .find((chn) => chn.name === guildDb.moderationMessages.channel);
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
