const logger = require('../../utils/logger');

const { mention } = require('./commons');

module.exports = {
    name: 'ban',
    description: 'Bans the tagged user/users from server',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '[user  |  users]',
    permissions: 'BAN_MEMBERS',
    execute(message, args) {
        const client = message.client;
        const banUsers = args.map(arg => mention(client, arg));

        for (let i = 0; i < banUsers; i++) {
            if (!banUsers[i]) {
                banUsers.slice(i, 1);
            }
        }

        banUsers.forEach(user => {
            user.ban()
                .then((banned) => {
                    logger.info(`User: ${banned.id} is banned by: ${message.user.id}`, message.guild.id);
                    message.channel.send(`User: ${banned.user.tag} is banned from ${message.guild.name}`);
                })
                .catch(error => logger.error(error, message.guild.id));
        });

    },
};