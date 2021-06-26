const logger = require('../../utils/logger');
const { prefix } = require('../../config.json');


module.exports = {
    name: 'prefix',
    description: 'Shows bot\'s prefix.',
    guildOnly: false,
    args: false,
    aliases: [],
    usage: '',
    category: 'Info',
    execute(message) {
        logger.debug(`Prefix command has been used by:${message.author.id}`);
        return message.channel.send(`The prefix of ${message.client.user.tag} is "${prefix}"`);
    }
};
