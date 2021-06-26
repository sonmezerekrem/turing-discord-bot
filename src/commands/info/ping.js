const logger = require('../../utils/logger');


module.exports = {
    name: 'ping',
    description: 'Shows user latency.',
    guildOnly: false,
    args: false,
    aliases: ['latency'],
    usage: '',
    category: 'Info',
    execute(message) {
        logger.debug(`Ping command has been used by:${message.author.id}`);
        return message.reply(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
    }
};
