const logger = require('../../utils/logger');
const embed = require('../../embeds/infoEmbed');


module.exports = {
    name: 'info',
    description: 'Shows server information.',
    guildOnly: true,
    args: false,
    aliases: ['server', 'i'],
    usage: '',
    execute(message, args) {
        logger.debug(`Info command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send(embed.execute(message, []));
    }
};