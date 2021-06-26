const logger = require('../../utils/logger');


module.exports = {
    name: 'random',
    description: 'Gives a magical random number between 0 - 100.',
    guildOnly: false,
    args: false,
    aliases: ['rand'],
    usage: '',
    category: 'Fun',
    async execute(message) {
        logger.debug(`Random command has been used by:${message.author.id}`);
        const random = Math.floor(Math.random() * 100);
        return message.reply(`Your magical number is ${random}`);
    }
};
