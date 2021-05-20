const logger = require('../../utils/logger');

module.exports = {
    name: 'kick',
    description: 'Kicks the tagged user from server',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<user> [reason]',
    permissions: 'KICK_MEMBERS',
    category: 'Moderation',
    type: 'general',
    execute(message, args) {
        logger.debug(`Kick command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const kickUser = message.guild.member(message.mentions.users.first());

        const reason = `${args.length > 1 ? args[1] : 'No reason'}`;
        if (kickUser) {
            kickUser.kick(reason).then(kicked => {
                logger.info(`Member: ${kicked.id} was kicked at guild:${message.guild.id} by:${message.author.id} reason:${args[1] ? args.length > 1 : 'no reason given'}`);
                message.channel.send(`Member: ${kicked.user.tag} is kicked from ${message.guild.name}. Reason:${args[1] ? args.length > 1 : 'no reason given'}`);
            }).catch(error => logger.error(`${error.message} guild:${message.guild.id}`));
        }

    }
};