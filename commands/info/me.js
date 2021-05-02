const logger = require('../../utils/logger');

const embed = require('../../embeds/memberEmbed');

module.exports = {
    name: 'me',
    description: 'Shows member information.',
    guildOnly: true,
    args: false,
    aliases: ['member'],
    usage: '',
    execute(message, args) {
        logger.debug(`Me command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.reply(embed.execute(message, []));
    }
};