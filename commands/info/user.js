const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').user;
const api = require('../../utils/api');


module.exports = {
    name: 'user',
    description: 'Shows tagged user information.',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<user>',
    category: 'Info',
    cooldown: 300,
    async execute(message) {
        logger.debug(`Me command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const member = message.guild.member(message.mentions.users.first());
        if (member) {
            const result = await api.getMember(message.guild.id, member.id);
            return message.reply(embed(member, result));
        }
    }
};
