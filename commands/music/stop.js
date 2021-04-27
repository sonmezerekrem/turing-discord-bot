const logger = require('../../utils/logger');

const { queue,deletePlayMessage } = require('./commons');

module.exports = {
    name: 'stop',
    description: 'Stops the player and clears the queue',
    guildOnly: true,
    args: false,
    aliases: ['s'],
    usage: '',
    execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to stop the music!');

        if (!serverQueue) return message.channel.send('There is no song that I could stop!');

        serverQueue.songs = [];
        serverQueue.playing = null;
        serverQueue.connection.dispatcher.end();
        deletePlayMessage(message.guild)
    },
};