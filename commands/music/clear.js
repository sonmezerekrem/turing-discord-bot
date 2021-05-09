const logger = require('../../utils/logger');
const { queue } = require('./utils');


module.exports = {
    name: 'clear',
    description: 'Clears the song queue without stopping music',
    guildOnly: true,
    args: false,
    aliases: ['c'],
    usage: '',
    channel: true,
    async execute(message, args) {
        logger.debug(`Clear command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue)
            return message.channel.send('There is no song that I could clear!');

        if (!message.client.voice.connections.has(message.guild.id))
            return message.channel.send('There is no song that I could clear!');
        serverQueue.songs = [];
        serverQueue.playing = null;
    }
};