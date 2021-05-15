const logger = require('../../utils/logger');
const { queue } = require('./utils');


module.exports = {
    name: 'skip',
    description: 'Skips the current song.',
    guildOnly: true,
    args: false,
    aliases: ['next', 'n'],
    usage: '',
    channel: true,
    execute(message, args) {
        logger.debug(`Skip command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could skip!');

        if (!message.client.voice.connections.has(message.guild.id))
            return message.channel.send('There is no song that I could skip!');

        serverQueue.connection.dispatcher.end();
    }
};