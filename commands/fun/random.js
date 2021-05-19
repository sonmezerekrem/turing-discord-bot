const logger = require('../../utils/logger');


module.exports = {
    name: 'random',
    description: 'Gives a magical random number between 0 - 100',
    guildOnly: true,
    args: false,
    aliases: ['rand'],
    usage: '',
    category: 'Fun',
    type: 'general',
    execute: async function(message, args) {
        logger.debug(`Random command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const random = Math.floor(Math.random() * 100);
        return message.reply(`Your magical number is ${random}`);
    }
};