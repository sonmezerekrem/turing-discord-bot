const logger = require('../../utils/logger');
const { mention } = require('./utils');


module.exports = {
    name: 'ban',
    description: 'Bans the tagged user from server',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<member> <reason>',
    permissions: 'BAN_MEMBERS',
    execute(message, args) {
        logger.debug(`Ban command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const banMember = mention(message.client, args[0]);

        banMember.ban().then(banned => {
            logger.info(`Member: ${banned.id} was banned at guild:${message.guild.id} by:${message.author.id} reason:${args[1] ? args.length > 1 : 'no reason given'}`);
            message.channel.send(`Member: ${banned.user.tag} is banned from ${message.guild.name}. Reason:${args[1] ? args.length > 1 : 'no reason given'}`);
        }).catch(error => logger.error(`${error} guild:${message.guild.id}`));

    }
};