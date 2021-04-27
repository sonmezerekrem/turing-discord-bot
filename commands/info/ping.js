const logger = require('../../utils/logger');

module.exports = {
    name: 'ping',
    description: 'Shows user latency',
    guildOnly: true,
    args: false,
    aliases: ['latency'],
    usage: '',
    execute(message, args) {
        return message.reply(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
    },
};