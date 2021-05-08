const logger = require('../../utils/logger');

const { queue } = require('./utils');

module.exports = {
    name: 'loop',
    description: 'Loops the entire play queue.',
    guildOnly: true,
    args: false,
    aliases: ['lp'],
    usage: '',
    channel: true,
    execute(message, args) {
        logger.debug(`Loop command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could loop!');

        if (!message.client.voice.connections.has(message.guild.id))
            return message.channel.send('There is no song that I could loop!');

        serverQueue.loop = 1;

        message.channel.send('Play queue is looped.');
    }
};