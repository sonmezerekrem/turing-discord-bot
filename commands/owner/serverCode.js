const logger = require('../../utils/logger');
const api = require('../../utils/api');


module.exports = {
    name: 'server-code',
    description: 'Sends server code to owner',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: 'Owner',
    type: 'general',
    cooldown: 300,
    execute: async function(message) {
        logger.info(`Server-code command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const result = await api.getGuild(message.guild.id);

        if (result) {
            message.author.send(`The server code for ${message.guild.name} is **${result.serverCode}**. Keep it safe!`);
        }
    }
};