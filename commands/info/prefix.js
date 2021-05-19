const logger = require('../../utils/logger');
const { prefix } = require('../../config.json');


module.exports = {
    name: 'prefix',
    description: 'Shows bot\'s prefix',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: 'Info',
    type: 'general',
    execute(message, args) {
        logger.debug(`Prefix command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send(`The prefix of ${message.client.user.tag} is "${prefix}"`);
    }
};