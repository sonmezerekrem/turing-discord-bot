const logger = require('../../utils/logger');

module.exports = {
    name: 'top',
    description: 'Shows top ranked list in server',
    guildOnly: true,
    args: false,
    aliases: ['t', 'level', 'levels', 'rank', 'ranks'],
    usage: '',
    execute(message, args) {
        logger.debug(`Top command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send('We are trying to implement this command. It will be ready soon. Thank you for your interest.');
    }
};