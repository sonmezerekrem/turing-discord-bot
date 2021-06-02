const logger = require('../../utils/logger');
const {
    queue,
    deletePlayMessage
} = require('./utils');


module.exports = {
    name: 'stop',
    description: 'Stops the player and clears the queue',
    guildOnly: true,
    args: false,
    aliases: ['s'],
    usage: '',
    channel: true,
    category: 'Music',
    type: 'general',
    execute(message) {
        logger.debug(`Stop command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could stop!');

        if (!message.client.voice.connections.has(message.guild.id)) {
            return message.channel.send('There is no song that I could stop!');
        }

        serverQueue.songs = [];
        serverQueue.playing = null;
        serverQueue.connection.dispatcher.end();
        deletePlayMessage(message.guild);
    }
};
