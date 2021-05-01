const logger = require('../../utils/logger');

const { mention } = require('./commons');

module.exports = {
    name: 'kick',
    description: 'Kicks the tagged user/users from server',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '[user  |  users]',
    permissions: 'KICK_MEMBERS',
    execute(message, args) {
        logger.debug(`Kick command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const client = message.client;
        const kickUsers = args.map(arg => mention(client, arg));

        for (let i = 0; i < kickUsers; i++) {
            if (!kickUsers[i]) {
                kickUsers.slice(i, 1);
            }
        }
        logger.debug(`${kickUsers.join(', ')} have been given to ban from guild:${message.guild.id} by:${message.author.id}`);
        kickUsers.forEach(user => {
            user.kick()
                .then((kicked) => {
                    logger.info(`Member: ${kicked.id} was kicked at guild:${message.guild.id} by:${message.user.id} `);
                    message.channel.send(`Member: ${kicked.user.tag} is kicked from ${message.guild.name}`);
                })
                .catch(error => logger.error(`${error} guild:${message.guild.id}`));
        });

    }
};