const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').help;


module.exports = {
    name: 'help',
    description: 'List all of commands or info about a specific category or command.',
    guildOnly: false,
    args: false,
    aliases: ['h', 'commands'],
    usage: '[category or command name]',
    category: 'Info',
    execute(message, args) {
        logger.debug(`Help command has been used at guild:${message.guild ? message.guild.id : 'DM'} by:${message.author.id}`);
        return message.channel.send(embed(message, args));
    }
};
