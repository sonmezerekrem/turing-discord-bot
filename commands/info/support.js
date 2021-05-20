const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').support;


module.exports = {
    name: 'support',
    description: 'Sends the website of bot, Discord server invite link and other support channels of bot',
    guildOnly: false,
    args: false,
    aliases: [],
    usage: '',
    category: 'Info',
    type: 'general',
    execute(message, args) {
        logger.debug(`Support command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send(embed(message));
    }
};