const logger = require('../../utils/logger');
const { songEmbed } = require('../../utils/embed');
const { queue } = require('./commons');

module.exports = {
    name: 'song',
    description: 'Shows information about the current song',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to show song information!');

        if (!serverQueue) return message.channel.send('There is no song that I could show!');

        if (serverQueue.songs.length > 0) {
            if (serverQueue.playing !== null) {
                return message.channel.send(songEmbed(serverQueue.songs[serverQueue.playing], serverQueue.connection.dispatcher.streamTime));
            } else {
                return message.channel.send('There is no song that I could show!');
            }
        } else
            return message.channel.send('There is no song that I could show!');
    },
};