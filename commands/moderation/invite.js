const logger = require('../../utils/logger');


module.exports = {
    name: 'invite',
    description: 'Creates an invite link',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    permissions: 'CREATE_INSTANT_INVITE',
    category: 'Moderation',
    type: 'general',
    execute(message) {
        logger.debug(`Invite command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const channel = message.channel;

        channel.createInvite()
            .then(invite => {
                channel.send(`Here is your invite link: ${invite.url}`);
            })
            .catch(console.error);
    }
};