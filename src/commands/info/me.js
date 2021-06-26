const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').member;
const api = require('../../utils/api');


module.exports = {
    name: 'me',
    description: 'Shows member information.',
    guildOnly: true,
    args: false,
    aliases: ['member', 'profile'],
    usage: '',
    category: 'Info',
    async execute(message) {
        logger.debug(`Me command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const result = await api.getMember(message.guild.id, message.author.id);
        return message.reply(embed(message, result));
    }
};
