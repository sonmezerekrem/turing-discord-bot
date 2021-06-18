const logger = require('../../utils/logger');
const api = require('../../utils/api');


module.exports = {
    name: 'condel',
    description: 'Removes a connection from database about member',
    guildOnly: true,
    args: true,
    aliases: ['conndel', 'conndel', 'conrem', 'connrem'],
    usage: '<connection name>',
    category: 'Member',
    async execute(message, args) {
        logger.debug(`Remconn command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const result = api.removeMemberConnection(message.author.id, args.join(' '));
        if (result) {
            message.channel.send('Connection removed');
        }
        else {
            message.channel.send('Please control connection name');
        }
    }
};
