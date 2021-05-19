const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').member;


module.exports = {
    name: 'me',
    description: 'Shows member information.',
    guildOnly: true,
    args: false,
    aliases: ['member', 'profile'],
    usage: '',
    category: 'Info',
    type: 'general',
    execute(message, args) {
        logger.debug(`Me command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.reply(embed(message));
    }
};