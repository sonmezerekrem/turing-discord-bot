const logger = require('../../utils/logger');

module.exports = {
    name: 'clear-channel',
    description: 'Deletes all messages in channel',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '[number of messages]',
    permissions: 'MANAGE_CHANNELS',
    execute: async function(message, args) {
        logger.debug(`Clear-channel command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send('We are trying to implement this command. It will be ready soon. Thank you for your interest.');
    }
};