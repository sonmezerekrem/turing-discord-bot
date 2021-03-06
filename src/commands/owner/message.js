const logger = require('../../utils/logger');

module.exports = {
    name: 'message',
    description: 'Send message in given channel.',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<channel name> <message content>',
    category: 'Owner',
    execute(message, args) {
        logger.info(`Message command has been used at guild:${message.guild.id}`);

        const { guild } = message;

        const channel = guild.channels.cache.find((chn) => chn.name === args[0]);
        if (channel && (channel.type === 'text' || channel.type === 'news')) {
            const content = message.content.substring(args[0].length + 10);
            channel.send(content);
        }
    }
};
