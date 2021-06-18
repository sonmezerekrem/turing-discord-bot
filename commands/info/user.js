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
        if (member.user.bot) {
            return message.reply('This is a bot user. Please do not give bot users as argument for this command!');
        }
        if (member) {
            const result = await api.getMember(message.guild.id, member.id);
            if (result != null && result !== 404) {
                return message.reply(embed(member, result));
            }
            else {
                return message.channel.send('Sorry, I couldn\'t find any information about this user');
            }
        }
    }
};
