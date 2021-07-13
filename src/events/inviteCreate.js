const logger = require('../utils/logger');
const embed = require('../utils/embeds');
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
                    const moderatorChannel = channel.guild.channels.cache.get(guildDb.moderationMessages.channel);
                    if (moderatorChannel) {
                        moderatorChannel.send(embed.inviteEvent({
                            url: invite.url,
                            tag: user,
                            expires: invite.expiresAt,
                            guild: guild.name,
                            id: user.id,
                            avatar: user.avatarURL()
                        }));
                    }
                }
            }
        }
        catch (e) {
            logger.error(`Invite creation error: ${e.message}`);
        }
    }
};
