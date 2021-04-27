const logger = require('../../utils/logger');

const { queue } = require('./commons');

module.exports = {
    name: 'loopself',
    description: 'Loops the current song',
    guildOnly: true,
    args: false,
    aliases: ['ls'],
    usage: '',
    execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to loop the music!');

        if (!serverQueue) return message.channel.send('There is no song that I could loop!');

        serverQueue.loop = 2;

        message.channel.send('Current song is looped.');
    },
};