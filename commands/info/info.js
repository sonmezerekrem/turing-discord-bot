const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').serverInfo;


module.exports = {
    name: 'info',
    description: 'Shows server information.',
    guildOnly: true,
    args: false,
    aliases: ['server', 'i', 'guild'],
    usage: '',
    execute(message, args) {
        logger.debug(`Info command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send(embed(message));
    }
};