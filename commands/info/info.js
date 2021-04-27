const logger = require('../../utils/logger');

const { infoEmbed } = require('../../utils/embed');

module.exports = {
    name: 'info',
    description: 'Shows server information.',
    guildOnly: true,
    args: false,
    aliases: ['server', 'i'],
    usage: '',
    execute(message, args) {
        return message.channel.send(infoEmbed(message));
    },
};