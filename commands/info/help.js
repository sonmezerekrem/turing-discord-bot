const logger = require('../../utils/logger');
const { prefix } = require('../../config.json');
const { helpEmbed } = require('../../utils/embed');

module.exports = {
    name: 'help',
    description: 'List all of commands or info about a specific command.',
    guildOnly: true,
    args: false,
    aliases: ['h', 'commands'],
    usage: '[command name]',
    execute(message, args) {
        return message.channel.send(helpEmbed(message,args))
    },
};