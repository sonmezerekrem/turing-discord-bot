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
        const client = message.client;
        const kickUsers = args.map(arg => mention(client, arg));

        for (let i = 0; i < kickUsers; i++) {
            if (!kickUsers[i]) {
                kickUsers.slice(i, 1);
            }
        }

        kickUsers.forEach(user => {
            user.kick()
                .then((kicked) => {
                    logger.info(`User: ${kicked.id} is kicked by: ${message.user.id}`, message.guild.id);
                    message.channel.send(`User: ${kicked.user.tag} is kicked from ${message.guild.name}`);
                })
                .catch(error => logger.error(error, message.guild.id));
        });

    },
};