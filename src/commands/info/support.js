const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').support;


module.exports = {
    name: 'support',
    description: 'Sends the website of bot, Discord server invite link and bot support channels of bot.',
    guildOnly: false,
    args: false,
    aliases: ['contact'],
    usage: '',
    category: 'Info',
    execute(message) {
        logger.debug(`Support command has been used by:${message.author.id}`);
        return message.channel.send(embed(message));
    }
};
