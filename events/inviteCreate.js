const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { turing } = require('../config.json');

module.exports = {
    name: 'inviteCreate',
    execute: async function(invite) {

        try {
            const guild = invite.guild;
            const user = invite.inviter;
            logger.info(`New invite is created at guild: ${guild.name} user:${user.id}`);
            if (guild.id === turing) {
                let moderatorChannel = guild.channels.cache.find(channel => channel.name === 'moderation');
                moderatorChannel.send(embed('Invite Create', [user,invite.url, invite.expiresAt]));
            }
        }
        catch (e) {
            logger.error(e.message);
        }
    }
};