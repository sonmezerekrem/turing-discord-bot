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
        logger.debug(`Ban command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const client = message.client;
        const banUsers = args.map(arg => mention(client, arg));

        for (let i = 0; i < banUsers; i++) {
            if (!banUsers[i]) {
                banUsers.slice(i, 1);
            }
        }
        logger.debug(`${banUsers.join(', ')} have been given to ban from guild:${message.guild.id} by:${message.author.id}`);
        banUsers.forEach(user => {
            user.ban()
                .then((banned) => {
                    logger.info(`Member: ${banned.id} was banned at guild:${message.guild.id} by:${message.user.id} `);
                    message.channel.send(`Member: ${banned.user.tag} is banned from ${message.guild.name}`);
                })
                .catch(error => logger.error(`${error} guild:${message.guild.id}`));
        });

    }
};