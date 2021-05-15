const logger = require('../../utils/logger');


module.exports = {
    name: 'ping',
    description: 'Shows user latency',
    guildOnly: true,
    args: false,
    aliases: ['latency'],
    usage: '',
    execute(message, args) {
        logger.debug(`Ping command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.reply(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
    }
};