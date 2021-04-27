const logger = require('../../utils/logger');

const { queue } = require('./commons');

module.exports = {
    name: 'resume',
    description: 'Resumes the player',
    guildOnly: true,
    args: false,
    aliases: ['r'],
    usage: '',
    execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to resume the music!');

        if (!serverQueue) return message.channel.send('There is no song that I could resume!');

        if (serverQueue.connection.dispatcher.paused)
            serverQueue.connection.dispatcher.resume();
    },
};