const logger = require('../../utils/logger');

const { queue, deletePlayMessage } = require('./commons');

module.exports = {
    name: 'clear',
    description: 'Clears the song queue without stopping music',
    guildOnly: true,
    args: false,
    aliases: ['c'],
    usage: '',
    async execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to clear the play queue!');

        if (!serverQueue) return message.channel.send('There is no song that I could clear!');

        serverQueue.songs = [];
        serverQueue.playing = null;
        deletePlayMessage(message.guild)
    },
};