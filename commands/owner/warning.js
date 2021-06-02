const logger = require('../../utils/logger');
const { warning } = require('../../utils/embeds');

module.exports = {
    name: 'warning',
    description: 'Sends a warning embed in given channel for tagged member',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<channel name> <member>',
    category: 'Owner',
    type: 'general',
    execute(message, args) {
        logger.info(`Warning command has been used at guild:${message.guild.id}`);

        const { guild } = message;

        const channel = guild.channels.cache.find((chn) => chn.name === args[0]);
        if (channel && channel.type === 'text') {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                channel.send(warning(member, message.member.displayName, 'Admin Warning'));
            }
        }
    }
};
