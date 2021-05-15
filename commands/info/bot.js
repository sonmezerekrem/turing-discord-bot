const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').botInfo;


module.exports = {
    name: 'bot',
    description: 'Shows information about bot',
    guildOnly: true,
    args: false,
    aliases: ['turing'],
    usage: '[command name]',
    execute(message, args) {
        logger.debug(`Turing command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send(embed(message));
    }
};