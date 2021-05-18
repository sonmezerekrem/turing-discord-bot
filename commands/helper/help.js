const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').help;


module.exports = {
    name: 'help',
    description: 'List all of commands or info about a specific category or command.',
    guildOnly: true,
    args: false,
    aliases: ['h', 'commands'],
    usage: '[command name]',
    category: 'Helper',
    type: 'general',
    execute(message, args) {
        logger.debug(`Help command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send(embed(message, args));
    }
};