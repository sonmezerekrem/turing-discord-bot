const logger = require('../../utils/logger');


module.exports = {
    name: 'stop-typing',
    description: 'When bot stuck in typing situation, use this command',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: 'Other',
    type: 'general',
    execute(message) {
        logger.debug(`Stop-Timer command has been used at guild:${message.guild.id} by:${message.author.id}`);
        message.channel.stopTyping(true);
    }
};
