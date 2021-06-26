const logger = require('../../utils/logger');
const api = require('../../utils/api');


module.exports = {
    name: 'conadd',
    description: 'Add a connection to database about member.',
    guildOnly: true,
    args: true,
    aliases: ['connadd'],
    usage: '<connection url> <connection name>',
    category: 'Member',
    async execute(message, args) {
        logger.debug(`Addconn command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const result = api.addMemberConnection(message.author.id, args[0], args.slice(0, 1)
            .join(' '));
        if (result) {
            message.channel.send('Connection added');
        }
        else {
            message.channel.send('Please control connection name and url');
        }
    }
};
