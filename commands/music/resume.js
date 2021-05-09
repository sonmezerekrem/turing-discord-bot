const logger = require('../../utils/logger');
const { queue } = require('./utils');


module.exports = {
    name: 'resume',
    description: 'Resumes the player',
    guildOnly: true,
    args: false,
    aliases: ['r'],
    usage: '',
    channel: true,
    execute(message, args) {
        logger.debug(`Resume command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could resume!');

        if (!message.client.voice.connections.has(message.guild.id))
            return message.channel.send('There is no song that I could resume!');

        if (serverQueue.connection.dispatcher.paused)
            serverQueue.connection.dispatcher.resume();
    }
};