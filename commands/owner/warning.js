const logger = require('../../utils/logger');
const { warning } = require('../../utils/embeds');

module.exports = {
    name: 'warning',
    description: 'Gives a warning to user and send a information message in given channel',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<channel name> <member>',
    category: 'Owner',
    execute(message, args) {
        logger.info(`Warning command has been used at guild:${message.guild.id}`);

        const { guild } = message;

        const channel = guild.channels.cache.find((chn) => chn.name === args[0]);
        if (channel && channel.type === 'text') {
            const member = message.guild.member(message.mentions.users.first());

            if (member.user.bot) {
                return message.reply('This is a bot user. Please do not give bot users as argument for this command!');
            }

            if (member) {
                channel.send(warning(member, message.member.displayName, 'Admin Warning'));
            }
        }
    }
};
