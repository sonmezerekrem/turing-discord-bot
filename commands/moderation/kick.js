const logger = require('../../utils/logger');

const { mention } = require('./utils');

module.exports = {
    name: 'kick',
    description: 'Kicks the tagged user from server',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '[user  |  users]',
    permissions: 'KICK_MEMBERS',
    execute(message, args) {
        logger.debug(`Kick command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const kickUser =  mention(message.client, args[0]);

        kickUser.ban().then(kicked => {
            logger.info(`Member: ${kicked.id} was kicked at guild:${message.guild.id} by:${message.author.id} reason:${args[1] ? args.length > 1 : 'no reason given'}`);
            message.channel.send(`Member: ${kicked.user.tag} is kicked from ${message.guild.name}. Reason:${args[1] ? args.length > 1 : 'no reason given'}`);
        }).catch(error => logger.error(`${error} guild:${message.guild.id}`));


    }
};