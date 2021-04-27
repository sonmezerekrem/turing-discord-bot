const logger = require('../../utils/logger');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'prefix',
    description: 'Shows bot\'s prefix',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    execute(message, args) {
        return message.channel.send(`The prefix of ${message.client.user.tag} is "${prefix}"`);
    },
};