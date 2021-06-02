const logger = require('../../utils/logger');


module.exports = {
    name: 'stats',
    description: 'Shows server detailed stats.',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: 'Info',
    type: 'general',
    execute(message) {
        logger.debug(`Charts command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send('We are trying to implement this command. It will be ready soon. Thank you for your interest.');
    }
};
