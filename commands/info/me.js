const logger = require('../../utils/logger');

const { memberEmbed } = require('../../utils/embed');

module.exports = {
    name: 'me',
    description: 'Shows member information.',
    guildOnly: true,
    args: false,
    aliases: ['member'],
    usage: '',
    execute(message, args) {
        return message.reply(memberEmbed(message));
    },
};