const logger = require('../../utils/logger');
const api = require('../../utils/api');


module.exports = {
    name: 'remconn',
    description: 'Removes a connection from database',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<connection name>',
    category: 'Member',
    type: 'general',
    execute: async function(message, args) {
        logger.debug(`Remconn command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const result = api.removeMemberConnection(message.author.id, args[0]);
        if (result) {
            message.channel.send('Connection removed');
        }
        else {
            message.channel.send('Please control connection name');
        }
    }
};