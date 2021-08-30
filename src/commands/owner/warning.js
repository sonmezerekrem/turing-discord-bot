const logger = require('../../utils/logger');
const { warning } = require('../../utils/embeds');
const api = require('../../utils/api');


module.exports = {
    name: 'warning',
    description: 'Gives a warning to user and send a information message in given channel.',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<member> [reason]',
    category: 'Owner',
    execute(message, args) {
        logger.info(`Warning command has been used at guild:${message.guild.id}`);

        const member = message.guild.member(message.mentions.users.first());

        if (member.user.bot) {
            return message.reply('This is a bot user. Please do not give bot users as argument for this command!');
        }

        if (member) {
            message.channel.send(warning(member, message.member.displayName, `${args.length > 1 ? args.slice()
                .join(' ') : 'Admin Warning'}`));
            // TODO
            api.updateMember(message.guild.id, message.author.id, {});
        }
    }
};
