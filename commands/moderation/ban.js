const logger = require('../../utils/logger');


module.exports = {
    name: 'ban',
    description: 'Bans the tagged user from server.',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<member> <reason>',
    permissions: 'BAN_MEMBERS',
    category: 'Moderation',
    execute(message, args) {
        logger.debug(`Ban command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const banMember = message.guild.member(message.mentions.users.first());

        if (banMember.user.bot) {
            return message.reply('This is a bot user. Please do not give bot users as argument for this command!');
        }

        const reason = `${args.length > 1 ? args[1] : 'No reason'}`;
        if (banMember) {
            banMember.ban(reason)
                .then((banned) => {
                    logger.info(`Member: ${banned.id} was banned at guild:${message.guild.id} by:${message.author.id} reason:${args[1] ? args.length > 1 : 'no reason given'}`);
                    message.channel.send(`Member: ${banned.user.tag} is banned from ${message.guild.name}. Reason:${args[1] ? args.length > 1 : 'no reason given'}`);
                })
                .catch((error) => logger.error(`${error.message} guild:${message.guild.id}`));
        }
    }
};
