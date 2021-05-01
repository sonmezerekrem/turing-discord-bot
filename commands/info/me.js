const logger = require('../../utils/logger');

const { memberEmbed } = require('../../utils/embed');

module.exports = {
    name: 'me',
    description: 'Shows member information.',
    guildOnly: true,
    args: false,
    aliases: ['member'],
    usage: '',
    execute(message, args) {
        logger.debug(`Me command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.reply(memberEmbed(message));
    }
};